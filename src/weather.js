import { useState } from "react";
import axios from "axios";
import "./weather.css";

const apiKey = "YOUR_SHECODES_WEATHER_API_KEY";

export default function Weather(props) {
  const [city, setCity] = useState(props.defaultCity || "Pretoria");
  const [searchInput, setSearchInput] = useState(props.defaultCity || "Pretoria");
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  function search(event) {
    event.preventDefault();
    setLoading(true);
    setCity(searchInput);
    loadWeather(searchInput);
  }

  function formatDate(unixTimestamp) {
    let date = new Date(unixTimestamp * 1000);
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let dayName = days[date.getDay()];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");

    return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}`;
  }

  function handleCurrentResponse(response) {
    setWeatherData({
      city: response.data.city,
      temperature: Math.round(response.data.temperature.current),
      description: response.data.condition.description,
      iconUrl: response.data.condition.icon_url,
      wind: Math.round(response.data.wind.speed),
      date: formatDate(response.data.time),
    });
    setLoading(false);
  }

  function handleForecastResponse(response) {
    setForecast(response.data.daily.slice(0, 5));
  }

  function loadWeather(searchCity) {
    let currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchCity}&key=${apiKey}&units=metric`;
    axios.get(currentApiUrl).then(handleCurrentResponse).catch(() => setLoading(false));

    let forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${searchCity}&key=${apiKey}&units=metric`;
    axios.get(forecastApiUrl).then(handleForecastResponse);
  }

  if (loading && !weatherData) {
    loadWeather(city);
  }

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  function formatShortDate(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <main className="weather-app">
      <header>
        <h2 id="current-date">
          {weatherData ? weatherData.date : "Loading..."}
        </h2>
      </header>

      <form
        id="search-form"
        className="search-form"
        autoComplete="off"
        onSubmit={search}
      >
        <input
          type="text"
          id="search-input"
          placeholder="Enter city"
          required
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Submit</button>
      </form>

      {weatherData && (
        <section className="current-weather">
          <h1 id="current-temperature">
            <span className="icon">🌡️</span>
            <span id="temp-value">{weatherData.temperature}°C</span>
          </h1>
          <p id="weather-description">{weatherData.description}</p>
          <p id="current-city">
            <span id="city-name">{weatherData.city}</span>
            {loading && <span className="spinner" id="loading-spinner" />}
          </p>
          <p id="wind-speed">
            <span className="icon">🌬️</span>
            <span id="wind-value">{weatherData.wind} km/h</span>
          </p>
          <img
            id="weather-icon"
            alt={weatherData.description}
            src={weatherData.iconUrl}
          />
        </section>
      )}

      {forecast.length > 0 && (
        <section className="forecast" id="forecast-section">
          {forecast.map((day, index) => (
            <div className="weather-day" key={index}>
              <div className="day-name">{formatDay(day.time)}</div>
              <div className="day-date">{formatShortDate(day.time)}</div>
              <div className="day-icon">
                <img src={day.condition.icon_url} alt={day.condition.description} />
              </div>
              <div className="day-temp">
                {Math.round(day.temperature.maximum)}°C / {Math.round(day.temperature.minimum)}°C
              </div>
            </div>
          ))}
        </section>
      )}

      <footer>
        Coded by{" "}
        <a href="https://github.com/Nononyiko" target="_blank" rel="noreferrer">
          Tinyiko
        </a>
        , hosted on{" "}
        <a href="https://github.com/Nononyiko/nono-work" target="_blank" rel="noreferrer">
          GitHub
        </a>{" "}
        |{" "}
        <a href="https://app.netlify.com/teams/nononyiko/projects" target="_blank" rel="noreferrer">
          Netlify
        </a>
      </footer>
    </main>
  );
}