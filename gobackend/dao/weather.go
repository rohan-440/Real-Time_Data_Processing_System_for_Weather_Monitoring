package dao

import (
	"fmt"
	"time"

	"gobackend/models"
)

func CreateWeather(w *models.Weather) {
	w.CreatedAt = time.Now()
	DB.Create(w)
}

func GetWeather(city string) *models.Weather {
	w := models.Weather{}

	query := fmt.Sprintf("SELECT * FROM main.weathers WHERE city = '%s' ORDER BY created_at LIMIT 1", city)
	DB.Raw(query).Scan(&w)
	return &w
}

func CreateDailyAggregation(wa models.WeatherAggregation) {
	wa.CreatedAt = time.Now()
	DB.Create(wa)
}

func GetAggregations(city string) []*models.WeatherAggregation {
	var agg []*models.WeatherAggregation
	//limit for 10 days
	DB.Limit(10).Order("created_at").Find(&agg)
	return agg
}

func GetDominantWeather(city string, t time.Time) string {
	var dominant string
	DB.Table("weather").Select("SELECT dominant_weather, count(*)").
		Where(fmt.Sprintf("WHERE created_at > %d AND city = '%s'", t.Unix(), city)).Group("dominant_weather").
		Limit(1).Scan(&dominant)

	return dominant
}

func GetMinMaxAvgTemp(city string, t time.Time) *models.Temps {

	var temp models.Temps
	DB.Table("weather").Select("SELECT MIN(min_temp) as min_temp, MAX(max_temp) as max_temp, AVG(temp) as avg_temp").
		Where(fmt.Sprintf("WHERE created_at > %d AND city = '%s'", t.Unix(), city)).Scan(&temp)

	return &temp
}
