package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gobackend/dao"
)

func GetWeather(c *gin.Context) {
	city, _ := c.GetQuery("city")

	weather := dao.GetWeather(city)
	c.JSON(http.StatusOK, weather)
}

func GetAggregation(c *gin.Context) {
	city := c.Param("city")

	aggregations := dao.GetAggregations(city)
	c.JSON(http.StatusOK, aggregations)
}
