var lat = /* insert latitude */;
var lon = /* insert longitude */;
//set API key so dont have to type constantly
const apiKey = "43b7357822a36d0b892e1f9c4cb1bc5e";

var form = document.getElementById("location-form");


form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  var city = document.getElementById("city-input").value;
  //var state = document.getElementById("state-input").value;
  //var country = document.getElementById("country-input").value;
  var limit = 1; // Number of results to limit

  var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid={API key}`;

  fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        lat = data[0].lat;
        lon = data[0].lon;

        // Call the weather API with retrieved lat and lon values
        callWeatherAPI();
      } else {
        console.log("Ya making things up");
      }
    })
    .catch(error => {
      console.log("Error:", error);
    });
});

///////////////////////////////////---initial API call for current weather

function callWeatherAPI() { 
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  //Fetch api request
    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
        // Display the weather information in the weather-container div
        var weatherContainer = document.getElementById("weather-container");
        weatherContainer.innerHTML = ""; // Clear previous content




    // Pull relevant info required
    var city = data.city.name;
    var currentDate = new Date(data.list[0].dt * 1000).toLocaleDateString();
    var weatherIcon = data.list[0].weather[0].icon;
    var temperature = data.list[0].main.temp;
    var windSpeed = data.list[0].wind.speed;
    var humidity = data.list[0].main.humidity;

    // Create HTML elements for the weather information
    var weatherContainer = document.getElementById("weather-container");

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


////////

