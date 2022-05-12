// timestamp formatting functions

function formatTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${[day]}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[day]}`;
}

// user event functions

function showFahrenheitWeather(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#tempValue");
  let fahrenheitWeather = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitWeather;
}

function showCelsiusWeather(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#tempValue");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
function showCurrentCityWeather(response) {
  // unit conversion

  if (fahrenheitLink.className === "active") {
    tempValue.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
    
  } else {
    tempValue.innerHTML = Math.round(celsiusTemperature);
    
  }

  // weather params

  document.querySelector(
    "#humidityElement"
  ).innerHTML = `${response.data.main.humidity}`;
  document.querySelector("#windElement").innerHTML = `${Math.round(
    response.data.wind.speed
  )}`;
  document.querySelector("#descriptionElement").innerHTML =
    response.data.weather[0].description;
}

function showCurrentCity(city) {
  document.querySelector("#cityElement").innerHTML = city.data.name;
  document.querySelector("#cityElementNextDays").innerHTML = city.data.name;
}

function handleCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = `0ad145bfcc1ef1bfc5678ea389f3498a`;
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrlCurrent).then(showCurrentCity);
  axios.get(apiUrlCurrent).then(showCurrentCityWeather);
}

function getCoordinates(response) {
  navigator.geolocation.getCurrentPosition(handleCurrentPosition);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityName = document.querySelector("#user-input");
  search(cityName.value);
}

// main functions

function convertWeatherForecastTo(unitType) {
  dailyForecast.forEach(function (weekDay, index) {
    if (index > 0 && index < 7) {
      let tempMin = Math.round(weekDay.temp.min);
      let tempMax = Math.round(weekDay.temp.max);
      let min = document.querySelector("#forecastMin" + index);
      let max = document.querySelector("#forecastMax" + index);
      if (unitType === "metric") {
        min.innerHTML = tempMin;
        max.innerHTML = tempMax;
      } else {
        min.innerHTML = Math.round((tempMin * 9) / 5 + 32);
        max.innerHTML = Math.round((tempMax * 9) / 5 + 32);
      }
    }
  });
}

function displayForecast(response) {
  dailyForecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  dailyForecast.forEach(function (weekDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-4 col-md-2">
      <div class="card">
        <h6 class="card-title">${formatDay(weekDay.dt)}</h6>
        <div>
          <img
            src="http://openweathermap.org/img/wn/${
              weekDay.weather[0].icon
            }@2x.png"
            alt="${weekDay.weather[0].description}"
            class="iconNextDays" />
        </div>
        <div class="tempearture-next-days">
          <span class="temperature-next-days-max" id="forecastMax${index}">${Math.round(
          weekDay.temp.max
        )}</span>°
          <span class="temperature-next-days-min" id="forecastMin${index}"> ${Math.round(
          weekDay.temp.min
        )}</span>°
      </div>
      </div>
    </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  if (fahrenheitLink.className === "active") {
    convertWeatherForecastTo("imperial");
  }
}

function searchCoordinates(coordinates) {
  let apiKey = "0ad145bfcc1ef1bfc5678ea389f3498a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  celsiusTemperature = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  cityElementNextDays.innerHTML = response.data.name;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.weather[0].description;

  if (fahrenheitLink.className === "active") {
    tempValue.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
   
  } else {
    tempValue.innerHTML = Math.round(celsiusTemperature);

  }

  // weather icon
  weatherNowIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherNowIcon.setAttribute("alt", `${response.data.weather[0].description}`);

  // last updated
  timeElement.innerHTML = formatTime(response.data.dt * 1000);
  searchCoordinates(response.data.coord);
}

function search(city) {
  let apiKey = "0ad145bfcc1ef1bfc5678ea389f3498a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}
// variables

let unit = "metric";
let celsiusTemperature = null;
let dailyForecast = null;

//event listeners

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#button-addon");
searchButton.addEventListener("click", handleSubmit);

let currentLocation = document.querySelector("#button-geolocator");
currentLocation.addEventListener("click", getCoordinates);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitWeather);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusWeather);

search("Hong Kong");