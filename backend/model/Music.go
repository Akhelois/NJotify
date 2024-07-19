package model

type Music struct {
	MusicID   string `gorm:"type:varchar(255);primary_key"`
	MusicName string `gorm:"type:varchar(255)"`
	MusicSong string `gorm:"type:blob"`
	// ArtistID  string `gorm:"type:varchar(255)"`
	// AlbumID   string `gorm:"type:varchar(255)"`
	// Artist    Artist `gorm:"foreign_key:ArtistID; constraint:onUpdate:CASCADE, onDelete:SET NULL"`
}