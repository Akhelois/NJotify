package model

import "github.com/google/uuid"

type Track struct {
	TrackID   uuid.UUID `gorm:"type:uuid;primary_key"`
	AlbumID   uuid.UUID `gorm:"type:uuid"`
	TrackName string    `gorm:"type:varchar(255)"`
	TrackSong []byte    `gorm:"type:bytea"`
	Album     Album     `gorm:"foreignKey:AlbumID;references:AlbumID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
}