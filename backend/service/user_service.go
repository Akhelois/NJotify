package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type UserService interface {
	Create(users request.CreateUserRequest) error
	Insert(users request.RegisterRequest) error
	FindAll() []response.UserResponse
	FindUser(email string) (response.UserResponse, error)
	Login(email string, password string) (response.UserResponse, error)
	ResetPassword(request request.ResetPasswordRequest) error
}
