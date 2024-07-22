package request

type LoginRequest struct {
	Id       int    `validate:"required" json:"id"`
	Email    string `validate:"required" json:"email"`
	Password string `validate:"required" json:"password"`
}
