package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/go-playground/validator/v10"
)

type TrackServiceImpl struct {
	TrackRepository repository.TrackRepository
	Validate *validator.Validate
}

func NewTrackServiceImpl(trackRepository repository.TrackRepository, validate *validator.Validate) *TrackServiceImpl {
	return &TrackServiceImpl{
		TrackRepository: trackRepository,
		Validate: validate,
	}
}

func (t *TrackServiceImpl) Create(tracks request.CreateTrackRequest) error {
	err := t.Validate.Struct(tracks)
	if err != nil {
		return nil
	}

	trackModel := model.Track {
		AlbumID: tracks.AlbumID,
		TrackName: tracks.TrackName,
		TrackSong: []byte(tracks.TrackSong),
		Duration: tracks.Duration,
	}

	return t.TrackRepository.Save(trackModel)
}

func (t *TrackServiceImpl) FindAll() []response.TrackResponse {
	result, err := t.TrackRepository.FindAll()
	if err != nil {
		return nil
	}

	var tracks []response.TrackResponse
	for _, value := range result {
		track := response.TrackResponse {
			TrackID: value.TrackID,
			AlbumID: value.AlbumID,
			TrackName: value.TrackName,
			TrackSong: string(value.TrackSong),
			Duration: value.Duration,
		}
		
		tracks = append(tracks, track)
	}

	return tracks
}