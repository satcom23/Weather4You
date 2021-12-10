import { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherAction } from "./redux/slices/weatherSlices";

function App() {
  const [city, setCity] = useState("");

  //dispatch action
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWeatherAction(""));
  }, []);

  //select state from store
  const state = useSelector((state) => state);
  const { weather, loading, error } = state;

  //helper functions
  const temperatureConverter = (valTemp) => {
    valTemp = parseFloat(valTemp);
    valTemp = (valTemp - 273.15) * 1.8 + 32;
    return Math.round(valTemp);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      dispatch(fetchWeatherAction(city));
    }
  };

  let timeStamp = "";
  let shortStamp = "";
  let currentStamp = "";
  let day = "";
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const updateTime = () => {
    let currentTime = new Date();
    let hours = currentTime.getUTCHours();
    let minutes = currentTime.getUTCMinutes();
    let seconds = currentTime.getUTCSeconds();
    let year = currentTime.getUTCFullYear();
    let month = currentTime.getUTCMonth();
    let date = currentTime.getUTCDate();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    timeStamp = hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
      timeStamp += "PM";
    } else {
      timeStamp += "AM";
    }
    timeStamp = `${year}-${month + 1}-${date} ` + timeStamp;
    console.log(currentTime);
    return timeStamp;
  };
  const currentTime = () => {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let prefix = "AM";
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (hours > 12) {
      hours = hours - 12;
      prefix = "PM";
    }
    currentStamp = hours + ":" + minutes + " " + prefix;
    return currentStamp;
  };
  currentTime();
  updateTime();
  let forecast = weather?.list;
  // JSX starts here
  return (
    // conditional for dynamic background
    <div
      className={`App ${
        temperatureConverter(weather?.list[0].main.temp) <= 50 ? "cold" : ""
      }`}
    >
      <main>
        <div className="input">
          <input
            type="text"
            className="input-field"
            placeholder="Enter your location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="submit-button"
            onClick={() => dispatch(fetchWeatherAction(city))}
          />
        </div>
        {!weather?.list[0].main.temp ? (
          <h1>See the upcoming forecast </h1>
        ) : (
          <h1>The Date is {timeStamp} UTC</h1>
        )}
        {loading ? (
          <h1>Processing...</h1>
        ) : weather?.list[0].main.temp ? (
          <>
            <div className="location-box">
              <div className="location">
                {weather?.city.name}, {weather?.city.country}
              </div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {temperatureConverter(weather?.list[0].main.temp)}ºF
              </div>
              <div className="weather-icon">
                <img
                  src={`https://openweathermap.org/img/wn/${weather?.list[0].weather[0].icon}@4x.png`}
                  alt={`${weather?.list[0].weather.main}`}
                />
              </div>
              <div className="weather">
                It looks like {weather?.list[0].weather[0].main}
              </div>
              <ul>
                {forecast.map((item, index) => {
                  let unix_timestamp = item?.dt;
                  let date = new Date(unix_timestamp * 1000);

                  const shortTime = () => {
                    let shortTime = date;
                    let hours = shortTime.getUTCHours();
                    let minutes = shortTime.getUTCMinutes();

                    let prefix = "AM";
                    if (minutes < 10) {
                      minutes = "0" + minutes;
                    }
                    if (hours > 12) {
                      hours = hours - 12;
                      prefix = "PM";
                    }
                    shortStamp = hours + ":" + minutes + " " + prefix;
                    return shortStamp;
                  };
                  const dayPlacer = () => {
                    let dayStamp = date;
                    day = dayStamp.getUTCDay();
                    return day;
                  };
                  dayPlacer();
                  shortTime();
                  if (index < 12) {
                    return (
                      <>
                        <li key={index}>
                          {shortStamp}
                          <br />
                          {temperatureConverter(item.main.temp)}ºF
                          <img
                            src={`https://openweathermap.org/img/wn/${weather?.list[0].weather[0].icon}@2x.png`}
                            alt={`${weather?.list[0].weather.main}`}
                          />
                          <br />
                          {days[day]}
                        </li>
                      </>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </>
        ) : error?.message === "Nothing to geocode" ? (
          <></>
        ) : error ? (
          <h1>{error?.message}</h1>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}

export default App;
