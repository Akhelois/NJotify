package response

type AlbumResponse struct {
	AlbumID        string `json:"album_id"`
	UserID         int    `json:"user_id"`
	AlbumName      string `json:"album_name"`
	AlbumImage     string `json:"album_image"`
	AlbumYear      string `json:"album_year"`
	CollectionType string `json:"collection_type"`
}
