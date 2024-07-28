package models

import "time"

type Weather struct {
	Id              uint      `json:"id,omitempty" gorm:"primary_key"`
	City            string    `json:"city"`
	FeelsLike       float64   `json:"feels_like"`
	DominantWeather string    `json:"dominant_weather"`
	DateTime        uint64    `json:"dt"`
	Temp            float64   `json:"temp"`
	MinTemp         float64   `json:"min_temp"`
	MaxTemp         float64   `json:"max_temp"`
	CreatedAt       time.Time `json:"createdAt,omitempty"`
}

type WeatherAggregation struct {
	Id              uint      `json:"id,omitempty" gorm:"primary_key"`
	City            string    `json:"city"`
	AvgTemp         float64   `json:"avg_temp"`
	MinTemp         float64   `json:"min_temp"`
	MaxTemp         float64   `json:"max_temp"`
	DominantWeather string    `json:"dominant_weather"`
	CreatedAt       time.Time `json:"createdAt,omitempty"`
}

type Temps struct {
	MinTemp float64
	MaxTemp float64
	AvgTemp float64
}
