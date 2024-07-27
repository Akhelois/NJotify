package request

type RegisterRequest struct {
	Email    string `validate:"required" json:"email"`
	Password string `validate:"required" json:"password"`
	Token    string `validate:"required" json:"token"`
}
