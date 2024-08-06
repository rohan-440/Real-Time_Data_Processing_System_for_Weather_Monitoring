import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlertSettings = () => {
    const [city, setCity] = useState('');
    const [threshold, setThreshold] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch current threshold
        const fetchThreshold = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/alert_threshold/');
                if (response.data.length > 0) {
                    setThreshold(response.data[0].threshold);
                }
            } catch (error) {
                setError('Failed to fetch current threshold.');
            }
        };
        fetchThreshold();
    }, []);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleThresholdChange = (e) => {
        setThreshold(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.target.name === 'city') {
                fetchCurrentWeather();
            } else if (e.target.name === 'threshold') {
                saveThreshold();
            }
        }
    };

    const fetchCurrentWeather = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    units: 'metric',
                    appid: 'e62008a65bc2f60013cf91a54dc4e0cc'  // Replace with your API key
                }
            });
            const temperature = response.data.main.temp;
            setCurrentWeather(temperature);
            setError('');

            if (temperature >= threshold) {
                setAlertMessage(`🚨 Alert! The current temperature in ${city} is ${temperature}°C, which is above the threshold of ${threshold}°C.`);
            } else {
                setAlertMessage(`✅ The current temperature in ${city} is ${temperature}°C, which is below the threshold of ${threshold}°C.`);
            }
        } catch (error) {
            setError('Error fetching weather data. Please check the city name.');
            setCurrentWeather(null);
            setAlertMessage('');
        }
    };

    const saveThreshold = async () => {
        try {
            await axios.post('http://localhost:8000/api/set_alert_threshold/', { temperature_threshold: threshold });
            setSuccess('Threshold saved successfully!');
            setError('');
        } catch (error) {
            setError('Failed to save threshold. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg" style={{ backgroundColor: '#f0f8ff' }}>
                <h2 className="card-title mb-4 text-center" style={{ color: '#007bff' }}>Temperature Alert Settings</h2>
                <div className="form-group mb-4">
                    <input
                        type="text"
                        className="form-control mb-3"
                        value={city}
                        onChange={handleCityChange}
                        onKeyPress={handleKeyPress}
                        name="city"
                        placeholder="Enter city name"
                        style={{ textTransform: 'capitalize' }}
                    />
                    <input
                        type="number"
                        className="form-control mb-3"
                        value={threshold}
                        onChange={handleThresholdChange}
                        onKeyPress={handleKeyPress}
                        name="threshold"
                        placeholder="Enter temperature threshold in °C"
                    />
                </div>
                <button
                    onClick={fetchCurrentWeather}
                    className="btn btn-primary mt-3 w-100"
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                >
                    Check Weather
                </button>
                <button
                    onClick={saveThreshold}
                    className="btn btn-secondary w-100 mt-3"
                >
                    Save Threshold
                </button>
                {success && <p className="text-success mt-3 text-center">{success}</p>}
                {error && <p className="text-danger mt-3 text-center">{error}</p>}
                {alertMessage && (
                    <div className="alert mt-3" role="alert" style={{ backgroundColor: '#e9ecef', color: '#721c24', borderColor: '#f5c6cb' }}>
                        <p>{alertMessage}</p>
                    </div>
                )}
                {currentWeather !== null && (
                    <div className="mt-4">
                        <h3 className="text-center">Current Weather</h3>
                        <p className="text-center" style={{ fontSize: '1.2rem' }}>
                            The current temperature in {city} is {currentWeather}°C.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertSettings;
