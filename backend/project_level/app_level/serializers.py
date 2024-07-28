from rest_framework import serializers
from .models import weather_model,DailySummary

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = weather_model
        fields = '__all__'

class DailySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySummary
        fields = ['city', 'average_temp', 'max_temp', 'min_temp', 'dominant_weather_condition']
        
from .models import AlertThreshold

class AlertThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertThreshold
        fields = '__all__'

from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'

from .models import WeatherLog

class WeatherLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherLog
        fields = ['city', 'temperature', 'weather_condition', 'timestamp']