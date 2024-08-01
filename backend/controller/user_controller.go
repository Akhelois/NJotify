package controller

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
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
    email := ctx.Query("email")
    if email == "" {
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   "Email query parameter is required",
        })
        return
    }

    userResponse, err := controller.userService.FindUser(email)
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
            userResponse, err := controller.userService.FindUser(loginReq.Email)
            if err != nil {
                ctx.JSON(http.StatusInternalServerError, response.WebResponse{
                    Code:   http.StatusInternalServerError,
                    Status: "Internal Server Error",
                    Data:   "Failed to find user",
                })
                return
            }
            token, err := generateJWTToken(userResponse)
            if err != nil {
                ctx.JSON(http.StatusInternalServerError, response.WebResponse{
                    Code:   http.StatusInternalServerError,
                    Status: "Internal Server Error",
                    Data:   "Failed to generate token",
                })
                return
            }
            // fmt.Println(token)
            // ctx.SetCookie("Authorization", token, 3600, "/", "localhost", false, true)
            // cookie, err2 := ctx.Cookie("Authorization")
            
            http.SetCookie(ctx.Writer, &http.Cookie{
                Name: "Authorization", 
                Value: token,
                MaxAge: 3600,
                Path: "/",
                Domain: "localhost",
                HttpOnly: true,
            })
        
            cookie, err2 := ctx.Request.Cookie("Authorization")
        
            fmt.Println(err2)
            fmt.Println(cookie)


            ctx.JSON(http.StatusOK, response.WebResponse{
                Code:   http.StatusOK,
                Status: "Ok",
                Data:   userResponse,
                CokiesToken: token, 
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
    // err = bcrypt.CompareHashAndPassword([]byte(userResponse.Password), []byte(loginReq.Password))
    // if err != nil {
    //     fmt.Println("Password comparison failed (database):", err)
    //     ctx.JSON(http.StatusUnauthorized, response.WebResponse{
    //         Code:   http.StatusUnauthorized,
    //         Status: "Unauthorized",
    //         Data:   "Invalid email or password",
    //     })
    //     return
    // }

    // // Successful login
    // token, err := generateJWTToken(userResponse)
    // if err != nil {
    //     ctx.JSON(http.StatusInternalServerError, response.WebResponse{
    //         Code:   http.StatusInternalServerError,
    //         Status: "Internal Server Error",
    //         Data:   "Failed to generate token",
    //     })
    //     return
    // }

    // fmt.Println(token)
    // ctx.SetCookie("Authorization", token, 3600, "/", "localhost", false, true)
    

    // ctx.JSON(http.StatusOK, response.WebResponse{
    //     Code:   http.StatusOK,
    //     Status: "Ok",
    //     Data:   userResponse,
    // })
}

func generateJWTToken(user response.UserResponse) (string, error) {
    secret := "asihodc97tb8723d"
    claims := jwt.MapClaims{
        "sub": user.Email,
        "id":  user.Id,
        "username": user.Username,
        "role": user.Role,
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
    registerRequest.Token = token

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

func (controller *UserController) EditProfilePicture(ctx *gin.Context) {
    file, _, err := ctx.Request.FormFile("profile_picture")
    if err != nil {
        fmt.Println("file upload error:", err)
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   "Profile picture is required",
        })
        return
    }
    defer file.Close()

    fileBytes, err := ioutil.ReadAll(file)
    if err != nil {
        fmt.Println("file read error:", err)
        ctx.JSON(http.StatusInternalServerError, response.WebResponse{
            Code:   http.StatusInternalServerError,
            Status: "Internal Server Error",
            Data:   "Unable to read the file",
        })
        return
    }

    email := ctx.Request.FormValue("email")
    fmt.Println("Received email:", email)
    if email == "" {
        ctx.JSON(http.StatusBadRequest, response.WebResponse{
            Code:   http.StatusBadRequest,
            Status: "Bad Request",
            Data:   "Email is required",
        })
        return
    }

    err = controller.userService.EditProfilePicture(request.EditProfilePicture{
        Email:          email,
        ProfilePicture: fileBytes,
    })
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

func(c *UserController) ValCookies(ctx *gin.Context){
    cok, err := ctx.Cookie("Authorization")

    fmt.Println(err)
    fmt.Println(cok)
}

func (c *UserController) GetVerified(ctx *gin.Context) {
	var getVerifiedReq request.GetVerifiedRequest

	if err := ctx.ShouldBindJSON(&getVerifiedReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	verificationKey := fmt.Sprintf("verification:%d", getVerifiedReq.Id)
	verificationData, err := json.Marshal(getVerifiedReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize verification request"})
		return
	}
	c.client.Set(ctx, verificationKey, verificationData, 0)

	ctx.JSON(http.StatusOK, gin.H{"message": "Verification request cached successfully"})
}

func (c *UserController) GetPendingVerifications(ctx *gin.Context) {
	keys, err := c.client.Keys(ctx, "verification:*").Result()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending verifications"})
		return
	}

	var pendingVerifications []request.GetVerifiedRequest
	for _, key := range keys {
		data, err := c.client.Get(ctx, key).Result()
		if err != nil {
			continue
		}

		var req request.GetVerifiedRequest
		if err := json.Unmarshal([]byte(data), &req); err != nil {
			continue
		}
		pendingVerifications = append(pendingVerifications, req)
	}

	ctx.JSON(http.StatusOK, gin.H{"data": pendingVerifications})
}

func (c *UserController) ApproveVerification(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification ID"})
		return
	}

	verificationKey := fmt.Sprintf("verification:%d", id)
	data, err := c.client.Get(ctx, verificationKey).Result()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Verification request not found"})
		return
	}

	var getVerifiedReq request.GetVerifiedRequest
	if err := json.Unmarshal([]byte(data), &getVerifiedReq); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deserialize verification request"})
		return
	}

	if err := c.userService.GetVerified(getVerifiedReq); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.client.Del(ctx, verificationKey)

	ctx.JSON(http.StatusOK, gin.H{"message": "Verification approved successfully"})
}

func (c *UserController) RejectVerification(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification ID"})
		return
	}

	verificationKey := fmt.Sprintf("verification:%d", id)
	if err := c.client.Del(ctx, verificationKey).Err(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete verification request"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Verification rejected successfully"})
}