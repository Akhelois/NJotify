package main

import (
	"net/http"

	"github.com/Akhelois/tpaweb/controller"
	"github.com/Akhelois/tpaweb/database"
	"github.com/Akhelois/tpaweb/helper"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/Akhelois/tpaweb/router"
	"github.com/Akhelois/tpaweb/service"
	"github.com/go-playground/validator/v10"
)

func main() {
	db := database.ConnectDB()
	db.AutoMigrate(&model.User{})

	validate := validator.New()

	userRepository := repository.NewUserRepositoryImpl(db)
	userService := service.NewUserServiceImpl(userRepository, validate)
	userController := controller.NewUserController(userService)
	routes := router.NewRouter(userController)

	server := &http.Server{
		Addr:    ":8080",
		Handler: routes,
	}

	err := server.ListenAndServe()
	helper.CheckPanic(err)
}
