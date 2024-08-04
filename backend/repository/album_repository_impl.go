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

func (c *AlbumRepositoryImpl) Insert(album model.Album) error {
	query := "INSERT INTO albums (user_id, album_name, album_image, album_year, collection_type) VALUES (?, ?, ?, ?, ?)"
	result := c.Db.Exec(query, album.UserID, album.AlbumName, album.AlbumImage, album.AlbumYear, album.CollectionType)
	if result.Error != nil {
		fmt.Println(result.Error)
		return result.Error
	}
	return nil
}
