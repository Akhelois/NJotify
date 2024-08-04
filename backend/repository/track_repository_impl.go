package repository

import (
	"github.com/Akhelois/tpaweb/model"
	"gorm.io/gorm"
)

type TrackRepositoryImpl struct {
	Db *gorm.DB
}

func NewTrackRepositoryImpl (Db *gorm.DB) TrackRepository {
	return &TrackRepositoryImpl{Db : Db}
}

func (t *TrackRepositoryImpl) Save(track model.Track) error {
	result := t.Db.Create(&track)
	return result.Error
}

func (t *TrackRepositoryImpl) FindAll() ([]model.Track, error) {
	var tracks []model.Track
	result := t.Db.Find(&tracks)
	return tracks, result.Error
}

func (t *TrackRepositoryImpl) FindAlbum (albumID string) (model.Track, error) {
	var track model.Track
	result := t.Db.Where("album_id = ?", albumID).First(&track)
	return track, result.Error
}

func (t *TrackRepositoryImpl) FindTrackInAlbum(albumID string) ([]model.Track, error) {
	var tracks []model.Track
	result := t.Db.Where("album_id = ?", albumID).Find(&tracks)
	return tracks, result.Error
}