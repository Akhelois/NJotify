package model

import "github.com/google/uuid"

type Track struct {
	TrackID   uuid.UUID `gorm:"type:uuid;primary_key"`
	AlbumID   uuid.UUID `gorm:"type:uuid"`
	TrackName string    `gorm:"type:varchar(255)"`
	TrackSong []byte    `gorm:"type:bytea"`
	Duration  string    `gorm:"type:varchar(255)"`
	Album     Album     `gorm:"foreignKey:AlbumID;references:AlbumID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
}