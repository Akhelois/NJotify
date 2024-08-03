package model

type Track struct {
	TrackID   string `gorm:"type:varchar(255);primary_key"`
	AlbumID   string `gorm:"type:varchar(255)"`
	TrackName string `gorm:"type:varchar(255)"`
	TrackSong []byte `gorm:"type:bytea"`
	Duration  string `gorm:"type:varchar(255)"`
	Album     Album  `gorm:"foreignKey:AlbumID;references:AlbumID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
}