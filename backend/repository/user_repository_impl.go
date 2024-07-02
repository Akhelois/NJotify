package repository

import (
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
    return c.Db.Create(&user).Error
}

func (c *UserRepositoryImpl) ActivateUser(token string) error {
    return c.Db.Model(&model.User{}).Where("token = ?", token).Update("active", true).Error
}

func (c *UserRepositoryImpl) FindByToken(token string) (model.User, error) {
    var user model.User
    if err := c.Db.Where("token = ?", token).First(&user).Error; err != nil {
        return user, err
    }
    return user, nil
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

func (c *UserRepositoryImpl) UpdatePassword(email, hashedPassword string) error {
	query := "UPDATE users SET password = ? WHERE email = ?"
	err := c.Db.Exec(query, hashedPassword, email).Error
	return err
}