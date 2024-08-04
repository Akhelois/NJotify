package controller

import (
	"bytes"
	"fmt"
	"net/http"
	"strconv"

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

    err := ctx.Request.ParseMultipartForm(32 << 20) // 32MB limit
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userIDStr := ctx.Request.FormValue("user_id")
    albumName := ctx.Request.FormValue("album_name")
    albumImage, _, err := ctx.Request.FormFile("album_image")
    if err != nil && albumImage == nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Album image is required"})
        return
    }
    collectionType := ctx.Request.FormValue("collection_type")
    albumYear := ctx.Request.FormValue("album_year")

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var albumImageBytes []byte
    if albumImage != nil {
        buf := new(bytes.Buffer)
        _, err := buf.ReadFrom(albumImage)
        if err != nil {
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read album image"})
            return
        }
        albumImageBytes = buf.Bytes()
    }

    createAlbumReq := request.CreateAlbumRequest{
        UserID:         userID,
        AlbumName:      albumName,
        AlbumImage:     string(albumImageBytes),
        AlbumYear:      albumYear,
        CollectionType: collectionType,
    }

    albumID, err := c.albumService.Create(createAlbumReq)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"status": "Ok", "album_id": albumID})
}

func (c *AlbumController) FindAll(ctx *gin.Context) {
	albumResponse := c.albumService.FindAll()

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albumResponse,
	}
	ctx.JSON(http.StatusOK, webResponse)
}

func (c *AlbumController) Insert(ctx *gin.Context) {
	var insertAlbumReq request.CreateAlbumRequest
	if err := ctx.ShouldBindJSON(&insertAlbumReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request", "data": err.Error()})
		return
	}

	err := c.albumService.Insert(insertAlbumReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "data": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "Ok"})
}
