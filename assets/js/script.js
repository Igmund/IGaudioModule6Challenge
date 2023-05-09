const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";
var city = 

//Get current weather in "city" - potential to use async?
function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  //Get forecast weather for "city" - potential to use async?
 function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  function displayCurrentWeather(data) {
    const city = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const icon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = `
    <h2>${city}</h2>
    <p>Date: ${date}</p>
    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Icon Be Here">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;
}