import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherStats = () => {
    const [city, setCity] = useState('');
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [summarySaved, setSummarySaved] = useState(false);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchStats();
        }
    };

    const fetchStats = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        setLoading(true);
        setSummarySaved(false);
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e62008a65bc2f60013cf91a54dc4e0cc&units=metric`);
            const data = response.data;
            debugger;
            const summary = {
                average_temperature: data.main.temp, // Average temperature (current temperature)
                maximum_temperature: data.main.temp_max, // Maximum temperature
                minimum_temperature: data.main.temp_min, // Minimum temperature
                dominant_weather: data.weather[0].description // Dominant weather condition
            };
            setStats(summary);
            setError('');
        } catch (error) {
            debugger;
            setError('City Not Found');
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const saveWeatherSummary = async (summary) => {
        const payload = {
            city: city,
            average_temp: summary.average_temperature,
            max_temp: summary.maximum_temperature,
            min_temp: summary.minimum_temperature,
            dominant_weather_condition: summary.dominant_weather,
        };

        console.log('Saving summary:', payload);

        try {
            await axios.post('http://localhost:8000/api/save_daily_summary/', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSummarySaved(true);
        } catch (error) {
            console.error('Error saving weather summary:', error.response ? error.response.data : error.message);
            setError('Failed to save summary. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg" style={{ backgroundColor: '#f0f8ff' }}>
                <h1 className="card-title mb-4 text-center" style={{ color: '#007bff' }}>Daily Weather Summary</h1>
                <div className="form-group">
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter city"
                        className="form-control"
                        style={{ textTransform: 'capitalize' }}
                    />
                </div>
                <button
                    onClick={fetchStats}
                    className="btn btn-primary mt-3 w-100"
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                >
                    Get Weather Summary
                </button>
                {loading && <p className="mt-3 text-center">Loading...</p>}
                {error && <p className="text-danger mt-3 text-center">{error}</p>}
                {stats && (
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#e9ecef' }}>
                        <h3 className="mb-3" style={{ color: '#007bff' }}>Weather Summary for {city}</h3>
                        <p><strong>Average Temperature:</strong> {stats.average_temperature}°C</p>
                        <p><strong>Maximum Temperature:</strong> {stats.maximum_temperature}°C</p>
                        <p><strong>Minimum Temperature:</strong> {stats.minimum_temperature}°C</p>
                        <p><strong>Dominant Weather Condition:</strong> {stats.dominant_weather}</p>
                    </div>
                )}
                {summarySaved && <p className="text-success mt-3 text-center">Weather summary saved successfully!</p>}
            </div>
        </div>
    );
};

export default WeatherStats;
