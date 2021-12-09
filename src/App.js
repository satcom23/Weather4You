import { useState } from "react";
import "./index.css";
import axios from "axios";

function App() {
  const api = {
    key: "029ce530124449bad57430e958df0d80",
    base: "http://api.openweathermap.org/data/2.5/",
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const search = (evt) => {
    if (evt.key === "Enter") {
      axios
        .get(`${api.base}weather?q=${query}&appid=${api.key}`)
        .then((res) => res.data)
        .then((result) => {
          setWeather(result);
          setQuery("");
          console.log(result);
        });
    }
  };

  const dateBuilder = (dates) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[dates.getDay()];
    let date = dates.getDate();
    let month = months[dates.getMonth()];
    let year = dates.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const temperatureConverter = (valTemp) => {
    valTemp = parseFloat(valTemp);
    valTemp = (valTemp - 273.15) * 1.8 + 32;
    return Math.round(valTemp);
  };

  return (
    <div
      className={
        (typeof weather.main != "undefined")
          ? ((temperatureConverter(weather.main.temp) < 60)
            ? "App cold"
            : "App")
          : "App"
      }
    >
      <main>
        <div className="input">
          <input
            type="text"
            className="input-field"
            placeholder="Enter your location..."
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {typeof weather.main != "undefined" ? (
          <>
            {console.log(weather)}
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {temperatureConverter(weather.main.temp)}ºF
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
