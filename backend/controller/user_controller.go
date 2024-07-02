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
	loginRequest := request.LoginRequest{}
	err := ctx.ShouldBindJSON(&loginRequest)
	helper.CheckPanic(err)

	user, err := controller.userService.FindUser(loginRequest.Email)
	if err != nil {
		webResponse := response.WebResponse{
			Code:   http.StatusUnauthorized,
			Status: "Unauthorized",
			Data:   nil,
		}
		ctx.JSON(http.StatusUnauthorized, webResponse)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if err != nil {
		webResponse := response.WebResponse{
			Code:   http.StatusUnauthorized,
			Status: "Unauthorized",
			Data:   nil,
		}
		ctx.JSON(http.StatusUnauthorized, webResponse)
		return
	}

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   user,
	}
	ctx.JSON(http.StatusOK, webResponse)
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
    from := "akhelois80@gmail.com"
    password := "tuynqvnbslsidjjf"
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

	_, err := controller.userService.FindUser(forgotPasswordRequest.Email)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Email address not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "Ok", "message": "Reset link sent successfully"})
}

func isValidEmail(email string) bool {
	return regexp.MustCompile(`\S+@\S+\.\S+`).MatchString(email)
}

func (uc *UserController) ResetPassword(c *gin.Context) {
	var resetRequest request.ResetPasswordRequest
	if err := c.ShouldBindJSON(&resetRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	if err := uc.userService.ResetPassword(resetRequest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}
