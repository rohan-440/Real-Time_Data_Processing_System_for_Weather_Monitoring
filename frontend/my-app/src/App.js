import React from 'react';
import Weather from './components/weather'; // Ensure the filename is 'weather.js'
import WeatherSummary from './components/weathersummary'; // Ensure the filename is 'weathersummary.js'
import AlertSettings from './components/AlertSettings'; // Ensure the filename is 'AlertSettings.js'
import WeatherDashboard from './components/WeatherDashboard'; // Ensure the filename is 'WeatherDashboard.js'

const appContainerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const appHeaderStyle = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  textAlign: 'center',
};

const appHeadingStyle = {
  color: '#007bff',
  fontSize: '2rem',
  margin: 0,
};

const appMainStyle = {
  padding: '20px',
};

const cardSectionStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
};

const cardStyle = {
  flex: '1 1 calc(50% - 20px)', // Adjust card width to fit two cards in a row
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  padding: '20px',
};

const App = () => {
  return (
    <div style={appContainerStyle}>
      <header style={appHeaderStyle}>
        <h1 style={appHeadingStyle}>!! Welcome to Weather Forecaster !!</h1>
      </header>
      <main style={appMainStyle}>
        <section style={cardSectionStyle}>
          <div style={cardStyle}>
            <Weather />
          </div>
          <div style={cardStyle}>
            <WeatherSummary />
          </div>
        </section>
        <section style={cardSectionStyle}>
          <div style={cardStyle}>
            <AlertSettings />
          </div>
          <div style={cardStyle}>
            <WeatherDashboard />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
