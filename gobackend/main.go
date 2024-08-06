package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gobackend/controller"
	"gobackend/dao"
	"gobackend/models"
	"gobackend/open_weather"
)

func main() {
	dao.ConnectDatabase("db")
	router := gin.Default()

	router.Use(CORSMiddleware())

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.GET("/api/alert_threshold/", func(c *gin.Context) {

		c.JSON(http.StatusOK, gin.H{
			"threshold": "50",
		})

	})

	//get weather
	router.GET("/weather", controller.GetWeather)

	//get weather Aggregates
	router.GET("/weather/aggregation", controller.GetAggregation)

	go getWeatherData()
	go calculateAggregates()

	router.Run()
}

// runs every 24 hours
func calculateAggregates() {
	cityList := getCityList()

	ticker := time.NewTicker(24 * time.Hour)
	for {
		select {
		case <-ticker.C:
			for _, city := range cityList {

				dominantWeather := dao.GetDominantWeather(city, beginOfDay(time.Now()))
				temps := dao.GetMinMaxAvgTemp(city, beginOfDay(time.Now()))

				wa := models.WeatherAggregation{
					City:            city,
					AvgTemp:         temps.AvgTemp,
					MinTemp:         temps.MinTemp,
					MaxTemp:         temps.MaxTemp,
					DominantWeather: dominantWeather,
				}

				dao.CreateDailyAggregation(wa)
			}
		}
	}
}

func beginOfDay(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 0, 0, 0, 0, t.Location())
}

func getCityList() []string {
	return []string{"Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"}
}

func getCityTempThreshold(city string) float64 {
	defaultThreshold := 60
	cityToTemp := map[string]float64{
		"Delhi":     50,
		"Mumbai":    50,
		"Chennai":   50,
		"Bangalore": 50,
		"Kolkata":   50,
		"Hyderabad": 50,
	}

	temp, ok := cityToTemp[city]
	if !ok {
		return float64(defaultThreshold)
	}
	return temp
}

func checkAlert(city string, weatherModel *models.Weather) {
	thresholdTemp := getCityTempThreshold(city)
	if weatherModel.Temp >= thresholdTemp {
		triggerAlert(city, weatherModel.Temp)
	}
}

func triggerAlert(city string, temp float64) {
	fmt.Println("triggering alert for city= ", city, " temperature= ", temp)
}

// runs every 5 minutes
func getWeatherData() {
	cityList := getCityList()

	ticker := time.NewTicker(5 * time.Second)
	for {
		select {
		case <-ticker.C:
			fmt.Println("Getting weather data")

			for _, city := range cityList {

				requestURL := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?q=%s&units=%s&appid=%s",
					city, "metric", "e62008a65bc2f60013cf91a54dc4e0cc")
				req, err := http.NewRequest(http.MethodGet, requestURL, nil)
				if err != nil {
					fmt.Printf("client: could not create request: %s\n", err)
					continue
				}

				res, err := http.DefaultClient.Do(req)
				if err != nil {
					fmt.Printf("client: error making http request: %s\n", err)
					continue
				}

				fmt.Printf("client: got response!\n")
				fmt.Printf("client: status code: %d\n", res.StatusCode)

				resBody, err := ioutil.ReadAll(res.Body)
				if err != nil {
					fmt.Printf("client: could not read response body: %s\n", err)
					continue
				}
				fmt.Printf("client: response body: %s\n", resBody)

				var body open_weather.Weather
				err = json.Unmarshal(resBody, &body)
				if err != nil {
					fmt.Println("cannot unmarshall request ", err)
					continue
				}

				weatherModel := body.ToModel()
				dao.CreateWeather(weatherModel)

				//process alert
				checkAlert(city, weatherModel)
			}
		}
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func KelvinToCelsius(temp float64) float64 {
	return temp - 273.15
}

func CelsiusToKelvin(temp float64) float64 {
	return temp + 273.15
}
