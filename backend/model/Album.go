package model

import "github.com/google/uuid"

type Album struct {
	AlbumID        uuid.UUID `gorm:"type:uuid;primary_key"`
	UserID         int       `gorm:"type:int"`
	AlbumName      string    `gorm:"type:varchar(255)"`
	AlbumImage     []byte    `gorm:"type:bytea"`
	AlbumYear      string    `gorm:"type:varchar(255)"`
	CollectionType string    `gorm:"type:varchar(255)"`
	User           User      `gorm:"foreignKey:UserID;references:Id;constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
}
