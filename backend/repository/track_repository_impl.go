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