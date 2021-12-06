var apiKey = "AIzaSyBm0Y6yauFGSkGDZ1sa2Lc054YJqMJ39Ig";

// Search City/History
var searchHistory;
// if user has any search history show from local storage
if (JSON.parse(localStorage.getItem("history")) != null)
  searchHistory = JSON.parse(localStorage.getItem("history"));
else searchHistory = [];

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", handleSearchResults);

searchList();

function handleSearchResults() {
  var search = document.getElementById("search").value;
  if (document.getElementById("search").value !== "") {
    // Get weather results on search and save city
    currentWeather(search);
    forecastSearch(search);

    saveSearch(search);
    renderSearch();
    // input city
    document.getElementById("search").value = "";

    // add in alert for search box being blank
  }
}

// Get weather info for the current day forecast
function currentWeather(search) {
  var currentDay = document.getElementById("current-day");
  currentDay.className = "";

  var currentApi = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;

  fetch(currentApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var currentEl = document.getElementById("current");
      currentEl.textContent = "";
      fetch(currentApi);

      // create a card to contain the weather info
      var cardTitle = document.createElement("h3");
      cardTitle.className = "card-title";
      // show date
      cardTitle.textContent = data.name + ": " + moment().format("LL");

      var cardContainer = document.createElement("div");
      cardContainer.className = "card";

      var card = document.createElement("div");
      card.className = "card-body";

      // temp
      var temperature = document.createElement("p");
      temperature.className = "card-text";
      temperature.textContent = "Temperature: " + data.main.temp + "°F";

      // humidity
      var humidity = document.createElement("p");
      humidity.className = "card-text";
      humidity.textContent = "Humidity: " + data.main.humidity + "%";

      // wind
      var wind = document.createElement("p");
      wind.className = "card-text";

      // UV Index (show diff color depending on UV condition)
      var uvIndex = document.createElement("p");
      uvIndex.className = "card-text";

      fetch(
        `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          uvIndex.textContent = "UV Index: " + data.value;
          if (data.value < 7) uvIndex.className = "text-warning";
          if (data.value < 3) uvIndex.className = "text-primary";
          else uvIndex.className = "text-danger";
        });

      // Add images icon coordinating to weather condition
      var imgEl = document.createElement("img");
      imgEl.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
      );

      cardTitle.appendChild(imgEl);
      card.appendChild(cardTitle);
      card.appendChild(temperature);
      card.appendChild(humidity);
      card.appendChild(wind);
      card.appendChild(uvIndex);
      cardContainer.appendChild(card);
      todayEl.appendChild(cardContainer);
    });
}

// 5 Day Forecast
function forecastSearch(search) {
  var forecastDiv = document.getElementById("forecast-div");
  forecastDiv.className = "";

  var forecast = document.getElementById("forecast");
  forecast.innerHTML = "";

  var forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${apiKey}&units=imperial`;

  fetch(forecastApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var forecastEl = document.getElementById("forecast");

      // Day-by-day
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes("12:00:00")) {
          var cards = document.createElement("div");

          var cardContainer = document.createElement("div");
          cardContainer.className = "card";

          var card = document.createElement("div");
          card.className = "card-body p-2";

          // Show date
          var cardHeader = document.createElement("h3");
          cardHeader.className = "card-title";
          cardHeader.textContent = moment(
            data.list[i].dt_txt.split("12:")[0]
          ).format("LL");

          //   temp
          var temperature = document.createElement("p");
          temperature.className = "card-text";
          temperature.textContent =
            "Temperature : " + data.list[i].main.temp_max + "°F";

          // humidity
          var humidity = document.createElement("p");
          humidity.className = "card-text";
          humidity.textContent =
            "Humidity : " + data.list[i].main.humidity + "%";

          // wind
          var wind = document.createElement("p");
          wind.className = "card-text";
          wind.textContent = "Wind Speed: " + data.list[i].wind.speed + "MPH";

          //   add images to elements
          var icon = document.createElement("img");
          icon.setAttribute(
            "src",
            `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
          );

          card.appendChild(cardHeader);
          card.appendChild(icon);
          card.appendChild(temperature);
          card.appendChild(humidity);
          card.appendChild(wind);
          cardContainer.appendChild(card);
          cards.appendChild(cardContainer);
          forecastEl.appendChild(cardContainer);
        }
      }
    });
}

function saveSearch(search){
    if(!searchHistory.includes(search)){
        searchHistory.push(search);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
}

function renderSearch(){
    while (document.getElementById("history").firstChild) {
        document.getElementById("history").removeChild(document.getElementById("history").firstChild);
    }
    searchList();
}

function searchList(){
    searchHistory.forEach(function (search){
        var historyItem = document.createElement("li");
        historyItem.className = "list-group-item";
        historyItem.textContent = search;
 
        historyItem.addEventListener("click", function(event){
            CurrentWeatherSearch(event.target.textContent);
            forecastSearch(event.target.textContent);
        });
        document.getElementById("history").appendChild(historyItem);
    });
}