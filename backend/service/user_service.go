package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type UserService interface {
	Create(request.CreateUserRequest) error
	Insert(request.RegisterRequest, string) error
	ActivateUser(string) error
	FindAll() []response.UserResponse
	FindUser(string) (response.UserResponse, error)
	FindByToken(token string) (response.UserResponse, error)
	Login(string, string) (response.UserResponse, error)
	ResetPassword(req request.ResetPasswordRequest) error
}
