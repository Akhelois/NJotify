package response

type UserResponse struct {
	Id             int    `json:"id"`
	Email          string `json:"email"`
	Username       string `json:"username"`
	Gender         string `json:"gender"`
	Dob            string `json:"dob"`
	Country        string `json:"country"`
	Password       string `json:"password"`
	Role           string `json:"role"`
	ProfilePicture string `json:"profile_picture"`
	Description    string `json:"description"`
	Followers      int    `json:"followers"`
	Following      int    `json:"following"`
	Token          string `json:"token"`
	Active         bool   `json:"active"`
}