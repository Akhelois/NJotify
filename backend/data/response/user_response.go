package response

type UserResponse struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Gender   string `json:"gender"`
	DOB      string `json:"dob"`
	Country  string `json:"country"`
	Password string `json:"password"`
}