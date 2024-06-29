package repository

import (
	"fmt"

	"github.com/Akhelois/tpaweb/model"
	"gorm.io/gorm"
)

type UserRepositoryImpl struct {
	Db *gorm.DB
}

func NewUserRepositoryImpl(Db *gorm.DB) UserRepository {
	return &UserRepositoryImpl{Db: Db}
}

func (c *UserRepositoryImpl) Save(user model.User) error {
	result := c.Db.Create(&user)
	return result.Error
}

func (c *UserRepositoryImpl) Insert(user model.User) error {
	query := `INSERT INTO users (email, password) VALUES ('%s', '%s')`
	err := c.Db.Exec(fmt.Sprintf(query, user.Email, user.Password)).Error
	return err
}

func (c *UserRepositoryImpl) FindAll() ([]model.User, error) {
	var users []model.User
	result := c.Db.Find(&users)
	return users, result.Error
}

func (c *UserRepositoryImpl) FindUser(email string) (model.User, error) {
	var user model.User
	result := c.Db.Where("email = ?", email).First(&user)
	return user, result.Error
}

func (c *UserRepositoryImpl) UpdatePassword(email, password string) error {
	return c.Db.Model(&model.User{}).Where("email = ?", email).Update("password", password).Error
}
