//set API key so dont have to type constantly
const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";

//Couldn't get borders to work - left in here to work on at later stage
// Function to hide or display the borders based on the subtitle visibility
// function toggleBorders() {
//   const forecastSubtitle = document.querySelector('.forecast-subtitle');
//   const cardRightnow = document.querySelector('.card-rightnow');
//   const cardForecast = document.querySelector('.card-forecast');

//   if (forecastSubtitle.classList.contains('hide-subtitle')) {
//     cardRightnow.style.border = 'none';
//     cardForecast.style.border = 'none';
//   } else {
//        cardRightnow.style.border = ''; 
//     cardForecast.style.border = '';
//   }
// }

// Call toggleBorders function on page load
// window.addEventListener('DOMContentLoaded', toggleBorders);

//Same for data not yet loaded
document.addEventListener('DOMContentLoaded', function() {
  const subtitle = document.querySelector('.subtitle');
  subtitle.classList.add('hide-subtitle');
});

// Get the city-history div element
const cityHistoryDiv = document.getElementById('city-history');

// Initialize an empty array to store the last 8 cities
let cityHistory = [];

// Load the city history from localStorage if available
if (localStorage.getItem('cityHistory')) {
  cityHistory = JSON.parse(localStorage.getItem('cityHistory'));

// Add each city to the city-history div as a button
  for (let i = 0; i < cityHistory.length; i++) {
    const cityButton = document.createElement('button');
    cityButton.innerText = cityHistory[i];
    cityButton.addEventListener('click', () => {
      // Refetch the weather data for the selected city and display the results
      fetchWeather(cityHistory[i]);
    });
    cityHistoryDiv.appendChild(cityButton);
  }
}

// Get the location form element
var locationForm = document.getElementById('location-form');

// Add an event listener for the form submit
locationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the city input value
  const cityInput = document.getElementById('city-input');
  const cityName = cityInput.value;

// Call  geoapp
fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      // Get the city coordinates from the API response
      const lat = data[0].lat;
      const lon = data[0].lon;

      // Check if the city already exists in cityHistory
      const cityIndex = cityHistory.indexOf(cityName);
      if (cityIndex !== -1) {
        // Remove the existing city from the array
        cityHistory.splice(cityIndex, 1);

        // Remove the corresponding button from the city-history div
        const existingButton = document.querySelector(`button[data-city="${cityName}"]`);
        if (existingButton) {
          existingButton.parentNode.removeChild(existingButton);
        }
      }

      // Store the city name in the cityHistory array
      cityHistory.unshift(cityName);

      // Remove the oldest city if the cityHistory array has more than 8 items
      if (cityHistory.length > 8) {
        const oldestCity = cityHistory.pop();
        const oldestCityButton = document.querySelector(`[data-city="${oldestCity}"]`);
        if (oldestCityButton) {
          oldestCityButton.parentNode.removeChild(oldestCityButton);
        }
      }

      // Save the cityHistory array to localStorage
      localStorage.setItem('cityHistory', JSON.stringify(cityHistory));

      // Create a new city button and add it to the city-history div
      const cityButton = document.createElement('button');
      cityButton.innerText = cityName;
      cityButton.setAttribute('data-city', cityName);
      cityButton.className = "city-butt";
      cityButton.addEventListener('click', () => {
        // Refetch the weather data for the selected city and display the results
        fetchWeather(cityButton.getAttribute('data-city'));
      });
      cityHistoryDiv.insertBefore(cityButton, cityHistoryDiv.firstChild);

  // Refetch the weather data for the selected city and display the results
  fetchWeather(cityName);
}
});
});

// Function to fetch the weather data and display the results
function fetchWeather(cityName) {
    // Fetch the current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        // Display the weather data in the weather-container div
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.classList.add('weather-card');
        weatherContainer.innerHTML = `
          <h3>${data.name}</h3>
          <p>${new Date(data.dt * 1000).toLocaleString()}</p>
          <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" style="width: 50px; height: 50px;">
          <p>Temperature: ${data.main.temp} °C</p>
          <p>Wind: ${data.wind.speed} m/s</p>
          <p>Humidity: ${data.main.humidity} %</p>
        `;    
        const currentWeatherSubtitle = document.getElementById('current-weather-subtitle');
currentWeatherSubtitle.classList.remove('hide-subtitle');
var forecastSubtitle = document.getElementById('forecast-subtitle');
  forecastSubtitle.style.display = 'block';

})
.catch(error => console.error(error));
  
   // Fetch the 5-day forecast data
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
.then(response => response.json())
.then(data => {
  // Get the forecast container
  const forecastContainer = document.getElementById('forecast-container');

  // Clear previous forecast content
  forecastContainer.innerHTML = '';

  // Iterate over the forecast data for each day
  for (let i = 0; i < data.list.length; i += 8) {
    const forecastItem = data.list[i];

    // Create a card element for each forecast day
    const card = document.createElement('div');
    card.classList.add('forecast-card');

    // Create the HTML content for the forecast day
    const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
    const temperature = forecastItem.main.temp;
    const wind = forecastItem.wind.speed;
    const humidity = forecastItem.main.humidity;
    const iconCode = forecastItem.weather[0].icon;
    const cityName = data.city.name;

    // Find minimum and maximum temperatures for the day
    const forecastDay = forecastItem.dt_txt.split(' ')[0];
    const temperaturesForDay = data.list.filter(item => item.dt_txt.includes(forecastDay)).map(item => item.main.temp);
    const minimum = Math.min(...temperaturesForDay);
    const maximum = Math.max(...temperaturesForDay);

// Get the current time as a string
const currentTime = new Date();
const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

   // Append the forecast data to the forecast card
card.innerHTML = `
<h3>${cityName}</h3>
<h4>${date}</h4>
<img src="https://openweathermap.org/img/w/${iconCode}.png">
<p>Temp at ${timeString}: ${temperature} °C</p>
<p>Wind: ${wind} m/s</p>
<p>Humidity: ${humidity} %</p>
<p>Minimum: ${minimum} °C</p>
<p>Maximum: ${maximum} °C</p>
`;

    // Append the forecast card to the forecast container
    forecastContainer.appendChild(card);
  }

  const forecastSubtitle = document.getElementById('forecast-subtitle');
  forecastSubtitle.classList.remove('hide-subtitle');
  
})

.catch(error => console.error(error));
}

