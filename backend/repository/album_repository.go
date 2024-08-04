package repository

import "github.com/Akhelois/tpaweb/model"

type AlbumRepository interface {
	Save(album model.Album) error
	FindAll() ([] model.Album, error)
	Insert(album model.Album) error
}