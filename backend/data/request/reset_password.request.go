package request

type ResetPasswordRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"new_password" validate:"required"`
}
