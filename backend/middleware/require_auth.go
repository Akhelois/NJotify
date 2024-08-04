package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Akhelois/tpaweb/database"
	"github.com/Akhelois/tpaweb/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
    tokenString, err := c.Cookie("Authorization")
    if err != nil {
        c.AbortWithStatus(http.StatusUnauthorized)
        return
    }

    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
        }
        return []byte("asihodc97tb8723d"), nil
    })
    if err != nil || !token.Valid {
        c.AbortWithStatus(http.StatusUnauthorized)
        return
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        if float64(time.Now().Unix()) > claims["exp"].(float64) {
            c.AbortWithStatus(http.StatusUnauthorized)
            return
        }

        var user model.User
        database.GetDB().Where("email = ?", claims["sub"]).First(&user)
        if user.Id == 0 {
            c.AbortWithStatus(http.StatusUnauthorized)
            return
        }

        c.Set("user", user)
        c.Next()
    } else {
        c.AbortWithStatus(http.StatusUnauthorized)
    }
}
