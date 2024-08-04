package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type AlbumService interface {
	Create(request.CreateAlbumRequest) (string, error)
	FindAll() []response.AlbumResponse
	Insert(request.CreateAlbumRequest) error
}
