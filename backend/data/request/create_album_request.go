package request

type CreateAlbumRequest struct {
	UserID         int    `validate:"required" json:"user_id"`
	AlbumName      string `validate:"required" json:"album_name"`
	AlbumImage     string `validate:"required" json:"album_image"`
	AlbumYear      string `validate:"required" json:"album_year"`
	CollectionType string `validate:"required" json:"collection_type"`
}