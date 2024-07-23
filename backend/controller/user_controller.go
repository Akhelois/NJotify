package controller

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/helper"
	"github.com/Akhelois/tpaweb/service"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

type UserController struct {
	userService service.UserService
    client *redis.Client
}

func NewUserController(service service.UserService, client *redis.Client) *UserController {
	return &UserController{
		userService: service,
        client : client,
	}
}

func (c *UserController) Validate(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "This is a protected endpoint",
	})
}

func (controller *UserController) Create(ctx *gin.Context) {
	fmt.Println("Creating User...")

	createUserReq := request.CreateUserRequest{}
	err := ctx.ShouldBindJSON(&createUserReq)
	helper.CheckPanic(err)

	controller.userService.Create(createUserReq)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) FindAll(ctx *gin.Context) {
	fmt.Println("Fetching all data...")
	userResponse := controller.userService.FindAll()

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) FindUser(ctx *gin.Context) {
    var editProfileReq request.EditUserRequest
    err := ctx.ShouldBindJSON(&editProfileReq)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   err.Error(),
        })
        return
    }

    userResponse, err := controller.userService.FindUser(editProfileReq.Email)
    if err != nil {
        ctx.JSON(http.StatusNotFound, response.WebResponse{
            Code:   http.StatusNotFound,
            Status: "User Not Found",
            Data:   err.Error(),
        })
        return
    }

    ctx.JSON(http.StatusOK, response.WebResponse{
        Code:   http.StatusOK,
        Status: "Ok",
        Data:   userResponse,
    })
}

func (controller *UserController) Login(ctx *gin.Context) {
    var loginReq request.LoginRequest
    err := ctx.ShouldBindJSON(&loginReq)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   err.Error(),
        })
        return
    }

    fmt.Println("Login attempt for email:", loginReq.Email)

    ctxBg := context.Background()
    cache, err := controller.client.Get(ctxBg, loginReq.Email).Result()
    if err == redis.Nil {
        fmt.Println("User not found in cache, querying database")
    } else if err != nil {
        fmt.Println("Error getting value from cache:", err)
        ctx.JSON(http.StatusInternalServerError, response.WebResponse{
            Code:   http.StatusInternalServerError,
            Status: "Internal Server Error",
            Data:   "Failed to retrieve cache",
        })
        return
    } else {
        fmt.Println("User found in cache:", cache)
        err = bcrypt.CompareHashAndPassword([]byte(cache), []byte(loginReq.Password))
        if err == nil {
            // Successful login
            token, err := generateJWTToken(loginReq.Email)
            if err != nil {
                ctx.JSON(http.StatusInternalServerError, response.WebResponse{
                    Code:   http.StatusInternalServerError,
                    Status: "Internal Server Error",
                    Data:   "Failed to generate token",
                })
                return
            }

            ctx.SetCookie("Authorization", token, 3600, "/", "localhost", false, true)
            user := response.UserResponse{
                Id: loginReq.Id,
                Email:    loginReq.Email,
                Password: loginReq.Password,
            }
            ctx.JSON(http.StatusOK, response.WebResponse{
                Code:   http.StatusOK,
                Status: "Ok",
                Data:   user,
            })
            return
        }
        fmt.Println("Password comparison failed (cache):", err)
    }

    userResponse, err := controller.userService.FindUser(loginReq.Email)
    if err != nil {
        fmt.Println("User not found in database:", err)
        ctx.JSON(http.StatusUnauthorized, response.WebResponse{
            Code:   http.StatusUnauthorized,
            Status: "Unauthorized",
            Data:   "Invalid email or password",
        })
        return
    }

    err = controller.client.Set(ctxBg, loginReq.Email, userResponse.Password, 30*time.Minute).Err()
    if err != nil {
        fmt.Println("Failed to cache user data:", err)
    } else {
        fmt.Println("User data cached successfully")
    }

    fmt.Println("User found in database:", userResponse.Email)
    err = bcrypt.CompareHashAndPassword([]byte(userResponse.Password), []byte(loginReq.Password))
    if err != nil {
        fmt.Println("Password comparison failed (database):", err)
        ctx.JSON(http.StatusUnauthorized, response.WebResponse{
            Code:   http.StatusUnauthorized,
            Status: "Unauthorized",
            Data:   "Invalid email or password",
        })
        return
    }

    // Successful login
    token, err := generateJWTToken(userResponse.Email)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, response.WebResponse{
            Code:   http.StatusInternalServerError,
            Status: "Internal Server Error",
            Data:   "Failed to generate token",
        })
        return
    }

    ctx.SetCookie("Authorization", token, 3600, "/", "localhost", false, true)
    ctx.JSON(http.StatusOK, response.WebResponse{
        Code:   http.StatusOK,
        Status: "Ok",
        Data:   userResponse,
    })
}

func generateJWTToken(email string) (string, error) {
    secret := "asihodc97tb8723d"
    claims := jwt.MapClaims{
        "sub": email,
        "exp": time.Now().Add(time.Hour * 1).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(secret))
}

func (controller *UserController) Register(c *gin.Context) {
    var registerRequest request.RegisterRequest
    if err := c.ShouldBindJSON(&registerRequest); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "data": err.Error()})
        return
    }

    token := generateToken()

    err := controller.userService.Insert(registerRequest, token)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err.Error()})
        return
    }

    err = sendVerificationEmail(registerRequest.Email, token)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "Ok"})
}

func (controller *UserController) ActivateUser(c *gin.Context) {
    token := c.Query("token")
    if token == "" {
        c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "data": "Token is required"})
        return
    }

    err := controller.userService.ActivateUser(token)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "Ok"})
}

func generateToken() string {
    bytes := make([]byte, 16)
    rand.Read(bytes)
    return hex.EncodeToString(bytes)
}

func sendVerificationEmail(email string, token string) error {
    from := "jlee211004@gmail.com"
    password := "dzmn brna gizn lgok"
    smtpHost := "smtp.gmail.com"
    smtpPort := "587"

    verificationLink := fmt.Sprintf("http://localhost:5173/activate?token=%s", token)
    body := fmt.Sprintf("Please click the following link to activate your account: %s", verificationLink)

    msg := gomail.NewMessage()
    msg.SetHeader("From", from)
    msg.SetHeader("To", email)
    msg.SetHeader("Subject", "Account Verification")
    msg.SetBody("text/plain", body)

    port, err := strconv.Atoi(smtpPort)
    if err != nil {
        return err
    }

    d := gomail.NewDialer(smtpHost, port, from, password)
    return d.DialAndSend(msg)
}

func (controller *UserController) Activate(c *gin.Context) {
    token := c.Query("token")
    err := controller.userService.ActivateUser(token)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"status": "Ok"})
}

func sendResetEmail(email, resetLink string) error {
    from := "jlee211004@gmail.com"
    password := "dzmnbrnagiznlgok"
    smtpHost := "smtp.gmail.com"
    smtpPort := 587

    m := gomail.NewMessage()
    m.SetHeader("From", from)
    m.SetHeader("To", email)
    m.SetHeader("Subject", "Password Reset")
    m.SetBody("text/html", fmt.Sprintf("Click <a href=\"%s\">here</a> to reset your password.", resetLink))

    d := gomail.NewDialer(smtpHost, smtpPort, from, password)

    if err := d.DialAndSend(m); err != nil {
        fmt.Println("Failed to send reset email:", err)
        return err
    }

    fmt.Println("Reset email sent successfully to:", email)
    return nil
}

func (controller *UserController) ForgotPassword(ctx *gin.Context) {
    var forgotPasswordRequest request.ForgotPasswordRequest
    if err := ctx.ShouldBindJSON(&forgotPasswordRequest); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if !isValidEmail(forgotPasswordRequest.Email) {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
        return
    }

    user, err := controller.userService.FindUser(forgotPasswordRequest.Email)
    if err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "Email address not found"})
        return
    }

    resetLink := fmt.Sprintf("http://localhost:5173/reset_password?email=%s", user.Email)
    err = sendResetEmail(user.Email, resetLink)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset email"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "Ok", "message": "Reset link sent successfully"})
}

func isValidEmail(email string) bool {
	return regexp.MustCompile(`\S+@\S+\.\S+`).MatchString(email)
}

func (controller *UserController) ResetPassword(ctx *gin.Context) {
    var req request.ResetPasswordRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    fmt.Printf("ResetPassword: original password: %s\n", req.Password)

    passwordPattern := `^[a-zA-Z0-9!@#$%^&*()_\-+=.]{10,}$`
    if !regexp.MustCompile(passwordPattern).MatchString(req.Password) {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least 1 letter, 1 number or special character, and be at least 10 characters long."})
        return
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    fmt.Printf("ResetPassword: new hashed password: %s\n", hashedPassword)

    err = controller.userService.ResetPassword(request.ResetPasswordRequest{
        Email:    req.Email,
        Password: string(hashedPassword),
    })
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}


func (controller *UserController) EditUser(ctx *gin.Context) {
    var editUserReq request.EditUserRequest
    err := ctx.ShouldBindJSON(&editUserReq)
    if err != nil {
        fmt.Println("Request binding error:", err)
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   err.Error(),
        })
        return
    }
    fmt.Println("EditUserRequest received:", editUserReq)
    err = controller.userService.EditUser(editUserReq)
    if err != nil {
        fmt.Println("Service error:", err)
        ctx.JSON(http.StatusInternalServerError, response.WebResponse{
            Code:   http.StatusInternalServerError,
            Status: "Internal Server Error",
            Data:   err.Error(),
        })
        return
    }

    ctx.JSON(http.StatusOK, response.WebResponse{
        Code:   http.StatusOK,
        Status: "Ok",
    })
}