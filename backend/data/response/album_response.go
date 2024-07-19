package response

type AlbumResponse struct {
	AlbumID    string `json:"album_id"`
	AlbumName  string `json:"album_name"`
	AlbumImage []byte `json:"album_image"`
}
