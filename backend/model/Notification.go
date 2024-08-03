package model

import "time"

type Notification struct {
	Id        int       `gorm:"type:int;primary_key"`
	UserId    int       `gorm:"type:int"`
	Type      string    `gorm:"type:varchar(255)"`
	Content   string    `gorm:"type:varchar(255)"`
	Seen      bool      `gorm:"default:false"`
	CreatedAt time.Time `gorm:"type:timestamp"`
}