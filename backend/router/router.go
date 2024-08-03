package router

import (
	"time"

	"github.com/Akhelois/tpaweb/controller"
	"github.com/Akhelois/tpaweb/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		c.Writer.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		c.Next()
	}
}

func NewRouter(userController *controller.UserController, albumController *controller.AlbumController, trackController *controller.TrackController) *gin.Engine {
	router := gin.Default()

	router.Use(SecurityHeaders())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))	

	// User
	router.GET("/find", userController.FindAll)
	router.GET("/find_user", userController.FindUser)
	router.POST("/users", userController.Create)
	router.POST("/login", userController.Login)	
	router.POST("/register", userController.Register)
	router.POST("/forgot_password", userController.ForgotPassword)
	router.POST("/reset_password", userController.ResetPassword)
	router.POST("/edit_profile", userController.EditUser)
	router.POST("/edit_picture_profile", userController.EditProfilePicture)
	
	router.GET("/get_cookies", userController.ValCookies)

	// Album
	router.GET("/find_all_album", albumController.FindAll)
	router.POST("/albums", albumController.Create)

	// Track
	router.GET("/find_all_track", trackController.FindAll)
	router.POST("/tracks", trackController.Create)

	// Verification
	router.POST("/get_verified", userController.GetVerified)
	router.POST("/approve_verification/:id", userController.ApproveVerification)
	router.DELETE("/reject_verification/:id", userController.RejectVerification)
	router.GET("/pending_verifications", userController.GetPendingVerifications)

	// Apply Middleware
	protected := router.Group("/")
	// Protected routes
	protected.Use(middleware.RequireAuth)
	{
		// protected.POST("/edit_profile", userController.EditUser)
		// protected.POST("/edit_picture_profile", userController.EditProfilePicture)
		protected.GET("/validate", middleware.RequireAuth , userController.Validate)
	}
	// protected.Use(middleware.RequireAuth)
	// protected.GET("/validate", middleware.RequireAuth, userController.Validate)

	return router
}
