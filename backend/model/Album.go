package model

type Album struct {
	AlbumID    string `gorm:"type:varchar(255);primary_key"`
	AlbumName  string `gorm:"type:varchar(255)"`
	AlbumImage []byte `gorm:"type:bytea"`
	AlbumYear  string `gorm:"type:varchar(255)"`
}
