package controller

import (
	"bytes"
	"encoding/base64"
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
		AlbumImage:     base64.StdEncoding.EncodeToString(albumImageBytes),
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

func (c *AlbumController) FindDischo(ctx *gin.Context) {
	userIDStr := ctx.Query("user_id")
	if userIDStr == "" {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   "UserID query parameter is required",
		})
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   "Invalid user ID",
		})
		return
	}

	albums, err := c.albumService.FindDischo(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.WebResponse{
			Code:   http.StatusNotFound,
			Status: "Dischopery Not Found",
			Data:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albums,
	})
}

func (c *AlbumController) FindAlbum(ctx *gin.Context) {
	albumID := ctx.Query("album_id")
	if albumID == "" {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   "AlbumID query parameter is required",
		})
		return
	}

	albumResponse, err := c.albumService.FindAlbum(albumID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.WebResponse{
			Code:   http.StatusNotFound,
			Status: "Album Not Found",
			Data:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albumResponse,
	})
}

func (c *AlbumController) FindAlbumName(ctx *gin.Context) {
	albumName := ctx.Query("album_name")
	if albumName == "" {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   "Album name query parameter is required",
		})
		return
	}

	albums, err := c.albumService.FindAlbumName(albumName)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.WebResponse{
			Code:   http.StatusNotFound,
			Status: "Album Not Found",
			Data:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   albums,
	})
}
