import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const WeatherDashboard = () => {
    const [city, setCity] = useState('');
    const [temperatureData, setTemperatureData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    };

    const fetchWeatherData = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const openWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                params: {
                    q: city,
                    units: 'metric',
                    appid: 'e62008a65bc2f60013cf91a54dc4e0cc'  // Replace with your API key
                }
            });

            const tempData = openWeatherResponse.data.list.map(entry => ({
                dt_txt: entry.dt_txt,
                temp_min: entry.main.temp_min,
                temp_max: entry.main.temp_max,
                temp: entry.main.temp,
                temp_day: entry.main.temp_day || entry.main.temp,
                temp_night: entry.main.temp_night || entry.main.temp
            }));
            setTemperatureData(tempData);
        } catch (error) {
            setError('Failed to fetch data from OpenWeatherMap.');
            setTemperatureData([]);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: temperatureData.map(data => new Date(data.dt_txt).toLocaleDateString()),
        datasets: [
            {
                label: 'Min Temperature (°C)',
                data: temperatureData.map(data => data.temp_min),
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Max Temperature (°C)',
                data: temperatureData.map(data => data.temp_max),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Day Temperature (°C)',
                data: temperatureData.map(data => data.temp_day),
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Night Temperature (°C)',
                data: temperatureData.map(data => data.temp_night),
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Current Temperature (°C)',
                data: temperatureData.map(data => data.temp),
                borderColor: '#6f42c1',
                backgroundColor: 'rgba(111, 66, 193, 0.2)',
                borderWidth: 1,
                fill: true,
            }
        ],
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg border-light" style={{ backgroundColor: '#f0f8ff' }}>
                <h1 className="text-center mb-4" style={{ color: '#007bff' }}>Weather Dashboard</h1>
                <div className="form-group mb-4">
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
                    onClick={fetchWeatherData}
                    className="btn btn-success w-100 mb-2"
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                >
                    Get Weather Data
                </button>
                {loading && <p className="mt-3 text-center">Loading...</p>}
                {error && <p className="text-danger mt-3 text-center">{error}</p>}

                {temperatureData.length > 0 && (
                    <div className="mt-4">
                        <h2 className="card-title mb-4" style={{ color: '#007bff' }}>Temperature Trends</h2>
                        <Line
                            data={chartData}
                            options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Temperature (°C)'
                                        },
                                        beginAtZero: false
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;
