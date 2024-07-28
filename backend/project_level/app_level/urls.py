from django.urls import path
from .views import WeatherListCreate, save_weather_data,calculate_weather_stats,save_daily_summary,get_weather_logs,get_alerts,set_alert_threshold,recent_weather_data

urlpatterns = [
    path('weather/', WeatherListCreate.as_view(), name='weather-list-create'),
    path('save_weather/', save_weather_data, name='save-weather-data'),
    path('weather_stats/<str:city>/', calculate_weather_stats, name='calculate_weather_stats'),
    path('save_daily_summary/', save_daily_summary, name='save_daily_summary'),
    path('weather_logs/', get_weather_logs, name='get_weather_logs'),
    path('alerts/', get_alerts, name='get_alerts'),
    path('set_alert_threshold/', set_alert_threshold, name='set_alert_threshold'),
    path('api/recent_weather/', recent_weather_data, name='recent_weather_data'),


]
