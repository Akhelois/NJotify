package service

import (
	"encoding/base64"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
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

func (c *AlbumServiceImpl) Create(album request.CreateAlbumRequest) (string, error) {
    err := c.Validate.Struct(album)
    if err != nil {
        return "", err
    }

    albumID := uuid.New()
    albumModel := model.Album{
        AlbumID:        albumID,
        UserID:         album.UserID,
        AlbumName:      album.AlbumName,
        AlbumImage:     []byte(album.AlbumImage),
        AlbumYear:      album.AlbumYear,
        CollectionType: album.CollectionType,
    }

    err = c.AlbumRepository.Save(albumModel)
    if err != nil {
        return "", err
    }

    return albumID.String(), nil
}

func (c *AlbumServiceImpl) FindAll() []response.AlbumResponse {
	result, err := c.AlbumRepository.FindAll()
	if err != nil {
		return nil
	}

	var albums []response.AlbumResponse
	for _, value := range result {
		album := response.AlbumResponse{
			AlbumID:         value.AlbumID.String(),
			UserID:          value.UserID,
			AlbumName:       value.AlbumName,
			AlbumImage:      string(value.AlbumImage),
			CollectionType:  value.CollectionType,
		}

		albums = append(albums, album)
	}

	return albums
}

func (c *AlbumServiceImpl) FindDischo(userID int) ([]response.AlbumResponse, error) {
    albums, err := c.AlbumRepository.FindDischo(userID)
    if err != nil {
        return nil, err
    }

    var albumResponses []response.AlbumResponse
    for _, album := range albums {
        var albumImageBase64 string
        if len(album.AlbumImage) > 0 {
            albumImageBase64 = base64.StdEncoding.EncodeToString(album.AlbumImage)
        }

        albumResponse := response.AlbumResponse{
            AlbumID:         album.AlbumID.String(),
            UserID:          album.UserID,
            AlbumName:       album.AlbumName,
            AlbumImage:      albumImageBase64,
            AlbumYear:       album.AlbumYear,
            CollectionType:  album.CollectionType,
        }
        albumResponses = append(albumResponses, albumResponse)
    }

    return albumResponses, nil
}
