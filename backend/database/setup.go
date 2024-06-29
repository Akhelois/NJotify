package database

import (
	"fmt"

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

func ConnectDB() *gorm.DB {
	sqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s",
		host,
		port,
		user,
		password,
		dbname)

	database, err := gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})

	if err != nil {
		panic("failed to connect to database")
	}

	helper.CheckPanic(err)

	return database
}
