package request

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

type CreateUserRequest struct {
	Email    string `validate:"required,email" json:"email"`
	Username string `validate:"required" json:"username"`
	Gender   string `validate:"required" json:"gender"`
	DOB      string `validate:"required,date" json:"dob"`
	Country  string `validate:"required" json:"country"`
	Password string `validate:"required,password" json:"password"`
	Role string `validate:"required" json:"role"`
	ProfilePicture string  `validate:"required" json:"profile_picture"`
	Description string  `validate:"required" json:"description"`
	Followers int `validate:"required" json:"followers"`
	Following int `validate:"required" json:"following"`
}

var validate *validator.Validate

func init() {
	validate = validator.New()
	validate.RegisterValidation("password", validatePassword)
}

func validatePassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	var (
		hasMinLen   = len(password) >= 10
		hasLetter   = regexp.MustCompile(`[a-zA-Z]`).MatchString(password)
		hasNumber   = regexp.MustCompile(`[0-9]`).MatchString(password)
		hasSpecial  = regexp.MustCompile(`[!@#\$%\^&\*]`).MatchString(password)
	)
	return hasMinLen && hasLetter && hasNumber && hasSpecial
}
