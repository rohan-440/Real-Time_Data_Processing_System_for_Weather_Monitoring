package dao

import (
	"gobackend/models"
	"gorm.io/driver/sqlite"
	_ "gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase(dbName string) {

	database, err := gorm.Open(sqlite.Open(dbName+"test.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	err = database.AutoMigrate(&models.Weather{})
	if err != nil {
		return
	}

	err = database.AutoMigrate(&models.WeatherAggregation{})
	if err != nil {
		return
	}

	DB = database
}
