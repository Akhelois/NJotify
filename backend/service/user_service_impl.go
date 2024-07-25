package service

import (
	"fmt"
	"time"

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
	validate.RegisterValidation("date", validateDate)

	return &UserServiceImpl{
		UserRepository: userRepository,
		Validate:       validate,
	}
}

func validateDate(fl validator.FieldLevel) bool {
	_, err := time.Parse("2006-01-02", fl.Field().String())
	return err == nil
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
		Role: users.Role,
		ProfilePicture: users.ProfilePicture,
		Description: users.Description,
		Followers: users.Followers,
		Following: users.Following,
		Active: false,
    }

    return c.UserRepository.Save(userModel)
}

func (c *UserServiceImpl) Insert(users request.RegisterRequest, token string) error {
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
        Token:    token,
        Active:   false,
    }

    return c.UserRepository.Insert(userModel)
}

func (c *UserServiceImpl) ActivateUser(token string) error {
    user, err := c.UserRepository.FindByToken(token)
    if err != nil {
        return err
    }

    user.Active = true
    user.Token = ""

    return c.UserRepository.Save(user)
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
		Username: user.Username,
		Email:    user.Email,
		Password: user.Password,
		Role: user.Role,
	}
	return userResponse, nil
}

func (service *UserServiceImpl) FindByToken(token string) (response.UserResponse, error) {
	userModel, err := service.UserRepository.FindByToken(token)
	if err != nil {
		return response.UserResponse{}, err
	}
	return response.UserResponse{
		Id:     userModel.Id,
		Email:  userModel.Email,
		Active: userModel.Active,
	}, nil
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
		// Username: user.Username,
		Email:    user.Email,
		Password: user.Password,
		// Role: user.Role,
	}

	fmt.Printf("Login successful for user: %+v", userResponse)

	return userResponse, nil
}

func (c *UserServiceImpl) ResetPassword(req request.ResetPasswordRequest) error {
    fmt.Printf("Resetting password for email: %s\n", req.Email)
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }

    err = c.UserRepository.UpdatePassword(req.Email, string(hashedPassword))
    if err != nil {
        return err
    }

    fmt.Printf("Password reset successful for email: %s\n", req.Email)
    return nil
}

func (c *UserServiceImpl) EditUser(editUserReq request.EditUserRequest) error {
	err := c.Validate.Struct(editUserReq)
	if err != nil {
		return err
	}

	userModel := model.User{
		Email:    editUserReq.Email,
		Username: editUserReq.Username,
		Gender:   editUserReq.Gender,
		DOB:      editUserReq.DOB,
		Country:  editUserReq.Country,
	}

	return c.UserRepository.UpdateUser(userModel)
}
