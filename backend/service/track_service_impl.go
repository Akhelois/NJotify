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

func (t *TrackServiceImpl) FindTrackInAlbum(albumID string) ([]response.TrackResponse, error)  {
	tracks, err := t.TrackRepository.FindTrackInAlbum(albumID)
	if err != nil {
		return nil, err
	}

	var trackResponses []response.TrackResponse
	for _, track := range tracks {
		var trackSongBase64 string
		if len(track.TrackSong) > 0 {
			trackSongBase64 = base64.StdEncoding.EncodeToString(track.TrackSong)
		}

		trackResponse := response.TrackResponse {
			TrackID: track.TrackID.String(),
			AlbumID: track.AlbumID.String(),
			TrackName: track.TrackName,
			TrackSong: trackSongBase64,
		}
		trackResponses =append(trackResponses, trackResponse)
	}

	return trackResponses, nil
}