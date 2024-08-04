package controller

import (
	"bytes"
	"net/http"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TrackController struct {
	trackService service.TrackService
}

func NewTrackController(service service.TrackService) *TrackController {
	return &TrackController{
		trackService: service,
	}
}

func (t *TrackController) Create(ctx *gin.Context) {
    err := ctx.Request.ParseMultipartForm(32 << 20) // 32MB limit
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    albumIDStr := ctx.Request.FormValue("album_id")
    trackName := ctx.Request.FormValue("track_name")
    trackSong, _, err := ctx.Request.FormFile("track_song")
    if err != nil && trackSong == nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Track song is required"})
        return
    }

    albumID, err := uuid.Parse(albumIDStr)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid album ID"})
        return
    }

    var trackSongBytes []byte
    if trackSong != nil {
        buf := new(bytes.Buffer)
        _, err := buf.ReadFrom(trackSong)
        if err != nil {
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read track song"})
            return
        }
        trackSongBytes = buf.Bytes()
    }

    createTrackReq := request.CreateTrackRequest{
        AlbumID:   albumID.String(),
        TrackName: trackName,
        TrackSong: string(trackSongBytes),
    }

    err = t.trackService.Create(createTrackReq)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "Ok"})
}

func (t *TrackController) FindAll(ctx *gin.Context) {
	trackResponse := t.trackService.FindAll()

	webResponse := response.WebResponse{
		Code: http.StatusOK,
		Status: "Ok",
		Data: trackResponse,
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (t *TrackController) Insert(ctx *gin.Context) {
	var insertTrackReq request.CreateTrackRequest
	if err := ctx.ShouldBindJSON(&insertTrackReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "data": err.Error()})
        return
	}

	err1 := t.trackService.Insert(insertTrackReq)
	if err1 != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err1.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "Ok"})
}
