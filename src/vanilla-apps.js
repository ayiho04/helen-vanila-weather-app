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



function showFahrenheitWeather(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#tempValue");
  let fahrenheitWeather = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitWeather;

  convertWeatherForecastTo("imperial");
}

function showCelsiusWeather(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#tempValue");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
 
  convertWeatherForecastTo("metric");
}

function showCurrentCityWeather(response) {

  if (fahrenheitLink.className === "active") {
    tempValue.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  
  } else {
    tempValue.innerHTML = Math.round(celsiusTemperature);
  
  }


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

function searchCoordinates(coordinates) {
 let apiKey = "69fa6b6b218161490d49a59d19fd1922";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  celsiusTemperature = response.data.main.temp;
cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.weather[0].description;

  if (fahrenheitLink.className === "active") {
    tempValue.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
   
  } else {
    tempValue.innerHTML = Math.round(celsiusTemperature); 
  }


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
  let apiKey = "69fa6b6b218161490d49a59d19fd1922";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}



let unit = "metric";
let celsiusTemperature = null;
let feelsLikeTemperature = null;
let dailyForecast = null;


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