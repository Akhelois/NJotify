package request

type EditUserRequest struct {
	Email    string `validate:"required,email" json:"email"`
	Username string `validate:"required" json:"username"`
	Gender   string `validate:"required" json:"gender"`
	DOB      string `validate:"required,date" json:"dob"`
	Country  string `validate:"required" json:"country"`
}