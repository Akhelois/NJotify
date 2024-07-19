package request

type CreateAlbumRequest struct {
	AlbumName  string `validate:"required" json:"album_name"`
	AlbumImage []byte `validate:"required" json:"album_image"`
}