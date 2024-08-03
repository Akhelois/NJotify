package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
)

type TrackService interface {
	Create(request.CreateTrackRequest) error
	FindAll() []response.TrackResponse
}