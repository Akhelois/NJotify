package service

import (
	"fmt"
	"log"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type UserServiceImpl struct {
	UserRepository repository.UserRepository
	Validate       *validator.Validate
}

func NewUserServiceImpl(userRepository repository.UserRepository, validate *validator.Validate) UserService {
	return &UserServiceImpl{
		UserRepository: userRepository,
		Validate:       validate,
	}
}

func (c *UserServiceImpl) Create(users request.CreateUserRequest) error {
	err := c.Validate.Struct(users)
	if err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(users.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	userModel := model.User{
		Email:    users.Email,
		Username: users.Username,
		Gender:   users.Gender,
		DOB:      users.DOB,
		Country:  users.Country,
		Password: string(hashedPassword),
	}

	return c.UserRepository.Save(userModel)
}

func (c *UserServiceImpl) Insert(users request.RegisterRequest) error {
	err := c.Validate.Struct(users)
	if err != nil {
		return err
	}

	hashPass, err := bcrypt.GenerateFromPassword([]byte(users.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	userModel := model.User{
		Email:    users.Email,
		Password: string(hashPass),
	}

	return c.UserRepository.Insert(userModel)
}

func (c *UserServiceImpl) FindAll() []response.UserResponse {
	result, err := c.UserRepository.FindAll()
	if err != nil {
		return nil
	}

	var users []response.UserResponse
	for _, value := range result {
		user := response.UserResponse{
			Id:       value.Id,
			Email:    value.Email,
			Password: value.Password,
		}

		users = append(users, user)
	}

	return users
}

func (c *UserServiceImpl) FindUser(email string) (response.UserResponse, error) {
	user, err := c.UserRepository.FindUser(email)
	if err != nil {
		return response.UserResponse{}, err
	}

	userResponse := response.UserResponse{
		Id:       user.Id,
		Email:    user.Email,
		Password: user.Password,
	}
	return userResponse, nil
}

func (c *UserServiceImpl) Login(email string, password string) (response.UserResponse, error) {
	user, err := c.UserRepository.FindUser(email)
	if err != nil {
		return response.UserResponse{}, err
	}

	fmt.Printf("Retrieved user: %+v", user)

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return response.UserResponse{}, err
	}

	userResponse := response.UserResponse{
		Id:       user.Id,
		Email:    user.Email,
		Password: user.Password,
	}

	log.Printf("Login successful for user: %+v", userResponse)

	return userResponse, nil
}

func (c *UserServiceImpl) ResetPassword(request request.ResetPasswordRequest) error {
	fmt.Printf("Resetting password for email: %s\n", request.Email)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	err = c.UserRepository.UpdatePassword(request.Email, string(hashedPassword))
	if err != nil {
		return err
	}

	fmt.Printf("Password reset successful for email: %s\n", request.Email)
	return nil
}
