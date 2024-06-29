package repository

import "github.com/Akhelois/tpaweb/model"

type UserRepository interface {
	Save(user model.User) error
	Insert(user model.User) error
	FindAll() ([]model.User, error)
	FindUser(email string) (model.User, error)
	UpdatePassword(email, password string) error
}
