package repository

import "github.com/Akhelois/tpaweb/model"

type TrackRepository interface {
	Save(track model.Track) error
	FindAll() ([]model.Track, error)
	FindAlbum(string) (model.Track, error)
	Insert(track model.Track) error
}