# Generated by Django 5.0.7 on 2024-07-24 05:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app_level', '0006_delete_weather_data'),
    ]

    operations = [
        migrations.CreateModel(
            name='weather_data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=250)),
                ('main', models.CharField(max_length=250)),
                ('temp', models.FloatField()),
                ('feels_like', models.FloatField()),
                ('dt', models.IntegerField()),
                ('min_temp', models.FloatField()),
                ('max_temp', models.FloatField()),
            ],
        ),
    ]
