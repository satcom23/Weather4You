import {useState} from 'react';
import "./index.css";
import axios from 'axios';



function App() {

  const api = {
    key: "029ce530124449bad57430e958df0d80",
    base: "http://api.openweathermap.org/data/2.5/",
  };

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if (evt.key === "Enter") {
        axios.get(`${api.base}weather?q=${query}&appid=${api.key}`)
          .then(res => res.json())
          .then(result => {
            setWeather(result);
            setQuery('');
            console.log(result)
          });
    }
  }

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

  return (
    <div className="App">
      <main>
        <div className="input">
          <input
            type="text"
            className="input-field"
            placeholder="Enter your location..."
            onChange={event => setQuery(event.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <>
        <div className="location-box">
          <div className="location">{weather.name}, {weather.sys.country}</div>
          <div className="date">{dateBuilder(new Date())}</div>
        </div>
        <div className="weather-box">
          <div className="temp">
            40ºF
          </div>
          <div className="weather">Sunny</div>
        </div>
        </>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
