package repository

import (
	"github.com/Akhelois/tpaweb/model"
)

type AlbumRepository interface {
	Save(album model.Album) error
	FindAll() ([] model.Album, error)
	FindDischo(int) ([]model.Album, error)
	FindAlbum(string) (model.Album, error)
	FindAlbumName(string) ([]model.Album, error)
}