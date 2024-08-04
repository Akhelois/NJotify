package request

type CreateTrackRequest struct {
	AlbumID   string `validate:"required" json:"album_id"`
	TrackName string `validate:"required" json:"track_name"`
	TrackSong string `validate:"required" json:"track_song"`
}