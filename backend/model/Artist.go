package model

type Artist struct {
	ArtistID   string `gorm:"type:varchar(255);primary_key"`
	ArtistName string `gorm:"type:varchar(255)"`
}