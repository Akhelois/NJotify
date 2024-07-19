package controller

import (
	"fmt"
	"net/http"

	"github.com/Akhelois/tpaweb/data/request"
	"github.com/Akhelois/tpaweb/data/response"
	"github.com/Akhelois/tpaweb/service"
	"github.com/gin-gonic/gin"
)

type AlbumController struct {
	albumService service.AlbumService
}

func NewAlbumController(service service.AlbumService) *AlbumController {
	return &AlbumController{
		albumService: service,
	}
}

func (c *AlbumController) Create(ctx *gin.Context) {
	fmt.Println("Creating Album..")

	var createAlbumReq request.CreateAlbumRequest
	err := ctx.ShouldBindJSON(&createAlbumReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = c.albumService.Create(createAlbumReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (c *AlbumController) FindAll(ctx *gin.Context) {
	fmt.Println("Fetching all data...")
	albumResponse := c.albumService.FindAll()

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albumResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}
