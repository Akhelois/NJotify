package request

type EditProfilePicture struct {
	Email          string `validate:"required" json:"email" binding:"required,email"`
	ProfilePicture []byte `validate:"required" json:"profile_picture"`
}