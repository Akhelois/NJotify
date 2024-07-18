package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Akhelois/tpaweb/controller"
	"github.com/Akhelois/tpaweb/database"
	"github.com/Akhelois/tpaweb/helper"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/Akhelois/tpaweb/router"
	"github.com/Akhelois/tpaweb/service"
	"github.com/go-playground/validator/v10"
	"github.com/go-redis/redis/v8"
)

func NewRedisClient() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",  
		Password : "",               
		DB:       0,
	})

	return client
}

func main() {
	rdb := NewRedisClient();
	fmt.Println(rdb.Context())
	
	ctx := context.Background();
	
	err_redis := rdb.Set(ctx, "foo", "bar", 0).Err()
	
	if err_redis != nil {
		fmt.Println("Cannot set valuee");
	}
	
	val, err1 := rdb.Get(ctx, "foo").Result()
	
	if err1 != nil {
		fmt.Println("Cannot get value");
	}
	fmt.Println("foo", val)

	db := database.ConnectDB()
	db.AutoMigrate(&model.User{})

	validate := validator.New()

	userRepository := repository.NewUserRepositoryImpl(db)
	userService := service.NewUserServiceImpl(userRepository, validate)
	userController := controller.NewUserController(userService, rdb)
	routes := router.NewRouter(userController)

	server := &http.Server{
		Addr:    ":8080",
		Handler: routes,
	}

	err := server.ListenAndServe()
	helper.CheckPanic(err)
}
