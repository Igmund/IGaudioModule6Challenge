//set API key so dont have to type constantly
const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";

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
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        // Get the city coordinates from the API response
        const lat = data[0].lat;
        const lon = data[0].lon;

        // Store the city name in the cityHistory array
        cityHistory.unshift(cityName);

        // Remove the oldest city if the cityHistory array has more than 6 items
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
      } else {
        console.error('Nah fairly certain that is not a real place');
      }
    })
    .catch(error => console.error(error));
});

// Function to fetch the weather data and display the results
function fetchWeather(cityName) {
    // Fetch the current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        // Display the weather data in the weather-container div
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = `
          <h2>${data.name}</h2>
          <p>${new Date(data.dt * 1000).toLocaleString()}</p>
          <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" style="width: 50px; height: 50px;">
          <p>Temperature: ${data.main.temp} °C</p>
          <p>Wind: ${data.wind.speed} m/s</p>
          <p>Humidity: ${data.main.humidity} %</p>
        `;
  
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
              //Still want to adjust this for a min/max with calculation if i have time
              const wind = forecastItem.wind.speed;
              const humidity = forecastItem.main.humidity;
              const iconCode = forecastItem.weather[0].icon;
  
              // Append the forecast data to the forecast card
              card.innerHTML = `
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/w/${iconCode}.png">
                <p>Temperature: ${temperature} °C</p>
                <p>Wind: ${wind} m/s</p>
                <p>Humidity: ${humidity} %</p>
              `;
  
              // Append the forecast card to the forecast container
              forecastContainer.appendChild(card);
            }
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
  