package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type AlbumService interface {
	Create(request.CreateAlbumRequest) error
	FindAll() []response.AlbumResponse
}