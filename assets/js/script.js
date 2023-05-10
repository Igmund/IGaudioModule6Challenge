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

        // Remove the oldest city if the cityHistory array has more than 8 items
        if (cityHistory.length > 8) {
          cityHistory.pop();
        }

        // Save the cityHistory array to localStorage
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));

        // Create a new city button and add it to the city-history div
        const cityButton = document.createElement('button');
        cityButton.innerText = cityName;
        cityButton.addEventListener('click', () => {
          // Refetch the weather data for the selected city and display the results
          fetchWeather(cityName);
        });
        cityHistoryDiv.insertBefore(cityButton, cityHistoryDiv.firstChild);

        // Refetch the weather data for the selected city and display the results
        fetchWeather(cityName);
      } else {
        console.error('Nah fairly certain tha is not a real place');
      }
    })
    .catch(error => console.error(error));
});

// Function to fetch the weather data and display the results
function fetchWeather(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display the weather data in the weather-container div
      const weatherContainer = document.getElementById('weather-container');
      weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>${new Date(data.dt * 1000).toLocaleString()}</p>
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Humidity: ${data.main.humidity} %</p>
      `})
    };