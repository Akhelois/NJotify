package model

type User struct {
	Id             int    `gorm:"type:int;primary_key"`
	Email          string `gorm:"type:varchar(255)"`
	Username       string `gorm:"type:varchar(255)"`
	Gender         string `gorm:"type:varchar(255)"`
	DOB            string `gorm:"type:varchar(255)"`
	Country        string `gorm:"type:varchar(255)"`
	Password       string `gorm:"type:varchar(255)"`
	Role           string `gorm:"type:varchar(255)"`
	ProfilePicture string `gorm:"type:varchar(255)"`
	Token          string `gorm:"type:varchar(255)"`
	Active         bool   `gorm:"type:boolean"`
}
