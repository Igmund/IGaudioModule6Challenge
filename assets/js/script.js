//set API key so dont have to type constantly
const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";

// Get references to the form and its input fields
var form = document.getElementById("location-form");
var cityInput = document.getElementById("city-input");
//var stateInput = document.getElementById("state-input");
//var countryInput = document.getElementById("country-input");

// Add an event listener to the form for a submit event
form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Get the user's input values from the form input fields
  var city = cityInput.value;
  //var state = stateInput.value;
 // var country = countryInput.value;

  // Make the API request to retrieve the latitude and longitude
  var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
      // Retrieve the latitude and longitude values
      var lat = data[0].lat;
      var lon = data[0].lon;

       // Log the lat and lon to the console
       console.log("Latitude:", lat);
       console.log("Longitude:", lon);

      // Update the values of the lat and lon variables
      lat = lat.toFixed(2);
      lon = lon.toFixed(2);

       // Use the lat and lon values to call the OpenWeatherMap API for the current weather
      var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
          // Display the weather information 
          var city = data.city.name;
          var currentDate = new Date(data.list[0].dt * 1000).toLocaleDateString();
          var weatherIcon = data.list[0].weather[0].icon;
          var temperature = data.list[0].main.temp;
          var windSpeed = data.list[0].wind.speed;
          var humidity = data.list[0].main.humidity;

          var weatherContainer = document.getElementById("weather-container");
          weatherContainer.innerHTML = "";

          var cityElement = document.createElement("h2");
          cityElement.textContent = city;
          weatherContainer.appendChild(cityElement);

          var dateElement = document.createElement("p");
          dateElement.textContent = "Current Date: " + currentDate;
          weatherContainer.appendChild(dateElement);

          var weatherIconElement = document.createElement("img");
          weatherIconElement.src = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
          weatherContainer.appendChild(weatherIconElement);

          var temperatureElement = document.createElement("p");
          temperatureElement.textContent = "Temperature: " + temperature + " °C";
          weatherContainer.appendChild(temperatureElement);

          var windElement = document.createElement("p");
          windElement.textContent = "Wind: " + windSpeed + " m/s";
          weatherContainer.appendChild(windElement);

          var humidityElement = document.createElement("p");
          humidityElement.textContent = "Humidity: " + humidity + " %";
          weatherContainer.appendChild(humidityElement);
        })
        .catch(error => {
          console.log("Error:", error);
        });
    })
    .catch(error => {
      console.log("Error:", error);
    });
});
