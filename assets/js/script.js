const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";
//var city = Need Geocoding API to implement conversion from long/lat
//Use same text $$$ ways

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
  
  //pull API info and assign const to the specific data
  function displayCurrentWeather(data) {
    const city = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const icon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    //Add info into html page to display
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

//Forecast display
function displayForecast(data) {
    //Iterate 5 days over - check slice vs i++
    const forecastItems = data.list.slice(0, 5);
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
  
 // Loop through each of the required items and display
 forecastItems.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const icon = item.weather[0].icon;
    const minTemperature = item.main.temp_min;
    const maxTemperature = item.main.temp_max;
    //Add elements - check criteria

    // New element for forecast
    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <h3>${date}</h3>
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
      <p>Min Temperature: ${minTemperature}°C</p>
      <p>Max Temperature: ${maxTemperature}°C</p>
    `;

    // Append the card to the forecast container
    forecastContainer.appendChild(card);
  });
}

  // Handlesearch - need to convert to co-ords via other API
// async function handleSearch() {
//     const cityInput = document.getElementById('city-input');
//     const city = cityInput.value.trim();
  
//     if (city !== '') {
//       try {
//         // Get current weather data
//         const currentWeather = await getCurrentWeather(city);
//         displayCurrentWeather(currentWeather);
  
//         // Get forecast data
//         const forecast = await getForecast(city);
//         displayForecast(forecast);
//       } catch (error) {
//         console.log('An error occurred:', error)

//       }
//     }
// };

