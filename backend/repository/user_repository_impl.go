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
    query := "INSERT INTO users (email, password, role, token) VALUES (?, ?, 'Listener', ?)"
    err := c.Db.Exec(query, user.Email, user.Password, user.Token).Error
    if err != nil {
        fmt.Println("Failed to insert user:", err)
    } else {
        fmt.Println("User inserted successfully:", user.Email)
    }
    return err
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
    if err != nil {
        fmt.Println("Failed to update password:", err)
    } else {
        fmt.Println("Password updated successfully for email:", email)
    }
    return err
}

func (c *UserRepositoryImpl) UpdateUser(user model.User) error {
    err := c.Db.Model(&model.User{}).Where("email = ?", user.Email).Updates(user).Error
    if err != nil {
        fmt.Println("Database update error:", err)
    }
    return err
}

func (c *UserRepositoryImpl) UpdateProfilePicture(profilePicture []byte, email string) error {
    fmt.Printf("Executing query: UPDATE users SET profile_picture = ? WHERE email = ?\n")
    fmt.Printf("Parameters: ProfilePicture length = %d, Email = %s\n", len(profilePicture), email)
    
    query := "UPDATE users SET profile_picture = ? WHERE email = ?"
    err := c.Db.Exec(query, profilePicture, email).Error
    if err != nil {
        fmt.Println("Failed to update profile picture:", err)
    } else {
        fmt.Println("Profile picture updated successfully for email:", email)
    }
    return err
}

func (c *UserRepositoryImpl) GetVerified(id int, profile_picture []byte, description string) error {
	query := "UPDATE users SET profile_picture = ?, role = 'Artist', description = ? WHERE id = ?"
	err := c.Db.Exec(query, profile_picture, description, id).Error
	if err != nil {
		fmt.Println("Failed to get verified:", err)
	}
	return err
}
