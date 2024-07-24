package request

type LoginRequest struct {
	Id       int    `validate:"required" json:"id"`
	Username string `validate:"required" json:"username"`
	Email    string `validate:"required" json:"email"`
	Password string `validate:"required" json:"password"`
	Role     string `validate:"required" json:"role"`
}
