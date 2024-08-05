package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type AlbumService interface {
	Create(request.CreateAlbumRequest) (string, error)
	FindAll() []response.AlbumResponse
	FindDischo(int) ([]response.AlbumResponse,error)
	FindAlbum(string) (response.AlbumResponse, error)
	FindAlbumName(string) ([]response.AlbumResponse, error)
}
