package repository

import (
	"fmt"

	"github.com/Akhelois/tpaweb/model"
	"gorm.io/gorm"
)

type AlbumRepositoryImpl struct {
	Db *gorm.DB
}

func NewAlbumRepositoryImpl (Db *gorm.DB) AlbumRepository {
	return &AlbumRepositoryImpl{Db: Db}
}

func (c *AlbumRepositoryImpl) Save(album model.Album) error {
	result := c.Db.Create(&album)
	return result.Error
}

func (c *AlbumRepositoryImpl) FindAll() ([]model.Album, error) {
	var albums []model.Album
	result := c.Db.Find(&albums)
	return albums, result.Error
}

func (c *AlbumRepositoryImpl) FindDischo(userID int) ([]model.Album, error) {
    var albums []model.Album
    result := c.Db.Where("user_id = ?", userID).Find(&albums)
    return albums, result.Error
}

func  (c *AlbumRepositoryImpl) FindAlbum(albumID string) (model.Album, error) {
	var albums model.Album
	result := c.Db.Where("album_id = ?", albumID).Find(&albums)
	return albums, result.Error
}

func (c *AlbumRepositoryImpl) FindAlbumName(albumName string) ([]model.Album, error) {
    var albums []model.Album
    fmt.Println("Searching for albums with name:", albumName)
    // result := c.Db.Where("album_name LIKE ?", "%"+albumName+"%").Find(&albums)
	result := c.Db.Where("LOWER(album_name) LIKE LOWER(?)", "%"+albumName+"%").Find(&albums)
    if result.Error != nil {
        fmt.Println("Error while searching for albums:", result.Error)
    } else {
        fmt.Println("Albums found:", albums)
    }
    return albums, result.Error
}
