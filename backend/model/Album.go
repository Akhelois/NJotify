package model

type Album struct {
	AlbumID        string `gorm:"type:varchar(255);primary_key"`
	UserID         int    `gorm:"type:int"`
	AlbumName      string `gorm:"type:varchar(255)"`
	AlbumImage     []byte `gorm:"type:bytea"`
	AlbumYear      string `gorm:"type:varchar(255)"`
	CollectionType string `gorm:"type:varchar(255)"`
	User           User   `gorm:"foreignKey:UserID;references:Id;constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
}
