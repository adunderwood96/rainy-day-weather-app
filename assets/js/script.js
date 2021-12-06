var apiKey = "AIzaSyBm0Y6yauFGSkGDZ1sa2Lc054YJqMJ39Ig";

// Search City/History 
var searchHistory;
// if user has any search history show from local storage
if (JSON.parse(localStorage.getItem("history")) != null)
    searchHistory = JSON.parse(localStorage.getItem("history"));
else
    searchHistory = [];

var searchBtn = document.querySelector("searchBtn");
searchBtn.addEventListener("click", handleSearchResults);

searchList();

function handleSearchResults() {
    var search = document.querySelector("search").value;
    if (document.querySelector("search").value !== "") {
        // Get weather results on search and save city
        currentWeather(search);
        forecastSearch(search);

        saveSearch(search);
        renderSearch();
        // input city
        document.querySelector("search").value = "";

        // add in alert for search box being blank
    }
}

// Get weather info for the current day forecast
function currentWeather(search) {
    var currentDay = document.querySelector("current-day");
    currentDay.className = "";

    var currentApi = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;

    fetch(currentApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var currentEl = document.querySelector("current");
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

            fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    uvIndex.textContent = "UV Index: " + data.value;
                    if (data.value < 7)
                        uvIndex.className = "text-warning";
                    if (data.value < 3)
                        uvIndex.className = "text-primary";
                    else
                        uvIndex.className = "text-danger";
                });

            // Add images icon coordinating to weather condition 
            var imgEl = document.createElement("img");
            imgEl.setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);

            cardHeader.appendChild(imgEl);
            card.appendChild(cardHeader);
            card.appendChild(temperature);
            card.appendChild(humidity);
            card.appendChild(wind);
            card.appendChild(uvIndex);
            cardContainer.appendChild(card);
            todayEl.appendChild(cardContainer);
        });
}
    
// 5-Day Forecast 