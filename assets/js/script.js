var apiKey = "AIzaSyBm0Y6yauFGSkGDZ1sa2Lc054YJqMJ39Ig";

// Search City/History 
var searchHistory;
if (JSON.parse(localStorage.getItem("history")) != null)
    searchHistory = JSON.parse(localStorage.getItem("history"));
else
    searchHistory = [];

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

            // create a card to contain the weather info 
            var cardHeader = document.createElement("h3");
            cardHeader.className = "card-title";
            // show date
            cardHeader.textContent = data.name + ": " + moment().format("LL");

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
            var uvIndex = document.createElement('p');
            uvIndex.className = "card-text";

