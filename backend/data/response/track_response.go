package response

type TrackResponse struct {
	TrackID   string `json:"track_id"`
	AlbumID   string `json:"album_id"`
	TrackName string `json:"track_name"`
	TrackSong string `json:"track_song"`
}