package controller

import (
	"net/http"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/service"
	"github.com/gin-gonic/gin"
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
	var createTrackReq request.CreateTrackRequest
	err := ctx.ShouldBindJSON(&createTrackReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	webResponse := response.WebResponse{
		Code: http.StatusOK,
		Status: "Ok",
		Data: nil,
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
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