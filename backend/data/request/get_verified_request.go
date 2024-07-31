package request

type GetVerifiedRequest struct {
	Id             int    `json:"id" validate:"required"`
	Role           string `json:"role" validate:"required"`
	Description    string `json:"description" validate:"required"`
	ProfilePicture string `json:"profile_picture" validate:"required"`
}
