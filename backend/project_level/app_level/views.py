from django.db.models import Avg, Count,Max,Min
from rest_framework import generics,status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import weather_model
from .serializers import WeatherSerializer,DailySummarySerializer
from .models import DailySummary
from .models import WeatherLog
from .serializers import DailySummarySerializer

class WeatherListCreate(generics.ListCreateAPIView):
    queryset = weather_model.objects.all()
    serializer_class = WeatherSerializer

@api_view(['POST'])
def save_weather_data(request):
    if request.method == 'POST':
        serializer = WeatherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def calculate_weather_stats(request, city):
    city_weather = weather_model.objects.filter(city=city)

    if not city_weather.exists():
        return Response({'error': 'City not found'}, status=404)

    avg_temp = city_weather.aggregate(Avg('temp'))['temp__avg']
    max_temp = city_weather.aggregate(Max('temp'))['temp__max']
    min_temp = city_weather.aggregate(Min('temp'))['temp__min']
    weather_counts = city_weather.values('main').annotate(count=Count('main')).order_by('-count')
    dominant_weather = weather_counts[0]['main'] if weather_counts else 'No data'

    return Response({
        'average_temperature': avg_temp,
        'maximum_temperature': max_temp,
        'minimum_temperature': min_temp,
        'dominant_weather': dominant_weather
    })

@api_view(['POST'])
def save_daily_summary(request):
    print("Received data:", request.data)  # For debugging
    serializer = DailySummarySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Daily summary saved successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import WeatherLog, AlertThreshold
from .serializers import WeatherLogSerializer

@api_view(['POST'])
def set_alert_threshold(request):
    threshold = request.data.get('threshold', 35)  # Default threshold value if not provided
    AlertThreshold.objects.update_or_create(
        defaults={'threshold': threshold}
    )
    return Response({"message": "Threshold set successfully"})

@api_view(['GET'])
def check_alerts(request):
    threshold = AlertThreshold.objects.first().threshold
    recent_logs = WeatherLog.objects.all().order_by('-timestamp')[:2]  # Get latest 2 records
    alerts = []
    
    if len(recent_logs) >= 2:
        for log in recent_logs:
            if log.temperature > threshold:
                alerts.append({
                    'city': log.city,
                    'temperature': log.temperature,
                    'weather_condition': log.weather_condition,
                    'timestamp': log.timestamp,
                })
    
    return Response({'alerts': alerts})

from .models import WeatherLog  # Ensure this import is correct
from .serializers import WeatherSerializer


@api_view(['GET'])
def get_weather_logs(request):
    logs = WeatherLog.objects.all().order_by('-timestamp')[:10]  # Example to get the latest 10 logs
    serializer = WeatherSerializer(logs, many=True)
    return Response(serializer.data)
                    
from .models import Alert
from .serializers import AlertSerializer

@api_view(['GET'])
def get_alerts(request):
    alerts = Alert.objects.all()  # Adjust as needed
    serializer = AlertSerializer(alerts, many=True)
    return Response(serializer.data)

from .serializers import WeatherLogSerializer

@api_view(['GET'])
def recent_weather_data(request):
    recent_logs = WeatherLog.objects.all().order_by('-timestamp')[:10]  # Fetch the latest 10 records
    serializer = WeatherLogSerializer(recent_logs, many=True)
    return Response(serializer.data)