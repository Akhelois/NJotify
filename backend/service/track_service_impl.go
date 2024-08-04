package service

import (
	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/model"
	"github.com/Akhelois/tpaweb/repository"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
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
		return err
	}

	albumID, err := uuid.Parse(tracks.AlbumID)
	if err != nil {
		return err
	}

	trackModel := model.Track{
		TrackID: uuid.New(),
		AlbumID:   albumID,
		TrackName: tracks.TrackName,
		TrackSong: []byte(tracks.TrackSong),
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
			TrackID: value.TrackID.String(),
			AlbumID: value.AlbumID.String(),
			TrackName: value.TrackName,
			TrackSong: string(value.TrackSong),
		}
		
		tracks = append(tracks, track)
	}

	return tracks
}

func (t *TrackServiceImpl) Insert(tracks request.CreateTrackRequest) error {
	err := t.Validate.Struct(tracks)

	if err != nil {
		return err
	}

	albumID, err := uuid.Parse(tracks.AlbumID)
	if err != nil {
		return err
	}

	trackModel := model.Track{
		AlbumID: albumID,
		TrackName: tracks.TrackName,
		TrackSong: []byte(tracks.TrackSong),
	}

	return t.TrackRepository.Insert(trackModel)
}