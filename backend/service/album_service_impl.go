package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/go-playground/validator/v10"
)

type AlbumServiceImpl struct {
	AlbumRepository repository.AlbumRepository
	Validate        *validator.Validate
}

func NewAlbumServiceImpl(albumRepository repository.AlbumRepository, validate *validator.Validate) *AlbumServiceImpl {
	return &AlbumServiceImpl{
		AlbumRepository: albumRepository,
		Validate:        validate,
	}
}

func (c *AlbumServiceImpl) Create(albums request.CreateAlbumRequest) error {
	err := c.Validate.Struct(albums)
	if err != nil {
		return err
	}

	albumModel := model.Album{
		UserID: albums.UserID,
		AlbumName:  albums.AlbumName,
		AlbumImage: []byte(albums.AlbumImage),
		AlbumYear: albums.AlbumYear,
		CollectionType: albums.CollectionType,
	}

	return c.AlbumRepository.Save(albumModel)
}

func (c *AlbumServiceImpl) FindAll() []response.AlbumResponse {
	result, err := c.AlbumRepository.FindAll()
	if err != nil {
		return nil
	}

	var albums []response.AlbumResponse
	for _, value := range result {
		album := response.AlbumResponse{
			AlbumID:    value.AlbumID,
			UserID: value.UserID,
			AlbumName:  value.AlbumName,
			AlbumImage: string(value.AlbumImage),
			CollectionType: value.AlbumYear,
		}

		albums = append(albums, album)
	}

	return albums
}
