package database

import (
	"fmt"
	"log"

	"github.com/Akhelois/tpaweb/helper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "localhost"
	port     = 5433
	user     = "postgres"
	password = "123"
	dbname   = "tpa_web"
)

var DB *gorm.DB

func ConnectDB() {
	sqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s",
		host,
		port,
		user,
		password,
		dbname)

	var err error
	DB, err = gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}

	helper.CheckPanic(err)
}

func GetDB() *gorm.DB {
	return DB
}
