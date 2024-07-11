package controller

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/helper"
	"github.com/Akhelois/tpaweb/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

type UserController struct {
	userService service.UserService
}

func NewUserController(service service.UserService) *UserController {
	return &UserController{
		userService: service,
	}
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
    userResponse, err := controller.userService.FindUser(loginReq.Email)
    if err != nil {
        fmt.Println("User not found:", err)
        ctx.JSON(http.StatusUnauthorized, response.WebResponse{
            Code:   http.StatusUnauthorized,
            Status: "Unauthorized",
            Data:   "Invalid email or password",
        })
        return
    }

    fmt.Println("User found:", userResponse.Email)
    fmt.Printf("Stored hashed password: %s\n", userResponse.Password)
    fmt.Printf("Provided password: %s\n", loginReq.Password)

    err = bcrypt.CompareHashAndPassword([]byte(userResponse.Password), []byte(loginReq.Password))
    if err != nil {
        fmt.Println("Password comparison failed:", err)
        ctx.JSON(http.StatusUnauthorized, response.WebResponse{
            Code:   http.StatusUnauthorized,
            Status: "Unauthorized",
            Data:   "Invalid email or password",
        })
        return
    }

    fmt.Println("Password comparison succeeded")
    ctx.JSON(http.StatusOK, response.WebResponse{
        Code:   http.StatusOK,
        Status: "Ok",
        Data:   userResponse,
    })
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
