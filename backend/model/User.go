package model

type User struct {
	Id       int    `gorm:"type:int;primay_key"`
	Email    string `gorm:"type:varchar(255)"`
	Username string `gorm:"type:varchar(255)"`
	Gender   string `gorm:"type:varchar(255)"`
	DOB      string `gorm:"type:date"`
	Country  string `gorm:"type:varchar(255)"`
	Password string `gorm:"type:varchar(255)"`
}