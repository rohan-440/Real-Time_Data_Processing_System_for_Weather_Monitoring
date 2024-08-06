package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gobackend/dao"
)

func GetWeather(c *gin.Context) {
	city, ok := c.GetQuery("city")
	if !ok || len(city) == 0 {
		c.Error(errors.New("invalid city"))
		return
	}

	weather := dao.GetWeather(city)
	c.JSON(http.StatusOK, weather)
}

func GetAggregation(c *gin.Context) {
	city := c.Param("city")

	aggregations := dao.GetAggregations(city)
	c.JSON(http.StatusOK, aggregations)
}
