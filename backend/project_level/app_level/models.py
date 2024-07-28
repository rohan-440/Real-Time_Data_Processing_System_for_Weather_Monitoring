from django.db import models

# Create your models here.
# model for weather data
class weather_model(models.Model):
    city = models.CharField(max_length=250)
    main = models.CharField(max_length=250)
    temp = models.FloatField()
    feels_like  = models.FloatField()
    dt = models.IntegerField()
    min_temp = models.FloatField()
    max_temp = models.FloatField()



#create model for daily summary


class DailySummary(models.Model):
    city = models.CharField(max_length=250)
    average_temp = models.FloatField()
    max_temp = models.FloatField()
    min_temp = models.FloatField()
    dominant_weather_condition = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.city} - {self.date}"

class AlertThreshold(models.Model):
    threshold = models.FloatField(default=35)  # Default threshold value

    def __str__(self):
        return f'Threshold: {self.threshold}°C'

class Alert(models.Model):
    city = models.CharField(max_length=250)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Alert for {self.city} at {self.timestamp}'

class WeatherLog(models.Model):
    city = models.CharField(max_length=250)
    temperature = models.FloatField()
    weather_condition = models.CharField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.city} - {self.temperature}°C - {self.weather_condition}'