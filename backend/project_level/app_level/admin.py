from django.contrib import admin
from .models import weather_model,DailySummary

#register the model of weatherdata
admin.site.register(weather_model)

#register the model of daily summary
admin.site.register(DailySummary)
