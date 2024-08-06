import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherForm = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const fetchWeather = async () => {
        try {

            const response = await axios.get(`http://localhost:8080/weather?city=${city}`);

            console.log(response)
            const weatherData = {
                city: response.data.city.toLowerCase(),
                main: response.data.dominant_weather,
                temp: response.data.temp,
                feels_like: response.data.feels_like,
                dt: response.data.dt,
                min_temp: response.data.min_temp,
                max_temp: response.data.max_temp
            };
            debugger;
            setWeather(weatherData);
            saveWeather(weatherData);
            setError('');
        } catch (error) {
            debugger;
            setError('Error fetching weather data. Please check the city name.');
        }
    };

    const saveWeather = async (weatherData) => {
        try {
            await axios.post('http://localhost:8000/api/save_weather/', weatherData);
        } catch (error) {
            console.error('Error saving weather data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeather();
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg" style={{ backgroundColor: '#f0f8ff' }}>
                <h1 className="text-center mb-4" style={{ color: '#007bff' }}>Get the Current Weather</h1>
                <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city name"
                            style={{ textTransform: 'capitalize' }}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary mt-3" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>Get Weather</button>
                    </div>
                </form>
                {error && <p className="text-danger mt-3 text-center">{error}</p>}
                {weather && (
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                        <h2>Weather in {weather.city.charAt(0).toUpperCase() + weather.city.slice(1)}</h2>
                        <p><strong>Main:</strong> {weather.main}</p>
                        <p><strong>Temperature:</strong> {weather.temp}°C</p>
                        <p><strong>Feels Like:</strong> {weather.feels_like}°C</p>
                        <p><strong>Min Temperature:</strong> {weather.min_temp}°C</p>
                        <p><strong>Max Temperature:</strong> {weather.max_temp}°C</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherForm;
