var apiKey = "768d8906dffdb8442fb5b977a6c0b4ff";

var searchHistory;
if(JSON.parse(localStorage.getItem("history")) != null)
    searchHistory = JSON.parse(localStorage.getItem("history"));
else    
    searchHistory = [];

var searchBtn = document.getElementById("search-button");
searchBtn.addEventListener("click", searchResults);

searchList();

function searchResults() {
    var search = document.getElementById("search").value;
    if (document.getElementById("search").value !== "") {

        weatherSearch(search);
        forecastSearch(search);

        saveSearch(search);
        renderSearch();

        document.getElementById("search").value = "";
    }
}

function weatherSearch(search) {
    var currentHeader = document.getElementById("current-header");
    currentHeader.className = "";

    var api = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var currentEl = document.getElementById("current");
            currentEl.textContent = "";

            var cardHeader = document.createElement("h3");
            cardHeader.className = "card-title";
            cardHeader.textContent = data.name + " - " + moment().format("LL");

            var cardContainer = document.createElement("div");
            cardContainer.className = "card";

            var card = document.createElement("div");
            card.className = "card-body";

            var wind = document.createElement("p");
            wind.className = "card-text";

            var humidity = document.createElement("p");
            humidity.className = "card-text";
            humidity.textContent = "Humidity: " + data.main.humidity + "%";

            var temperature = document.createElement("p");
            temperature.className = "card-text";
            temperature.textContent = "Temperature: " + data.main.temp + "°F";

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

            var imgEl = document.createElement("img");
            imgEl.setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);

            cardHeader.appendChild(imgEl);
            card.appendChild(cardHeader);
            card.appendChild(temperature);
            card.appendChild(humidity);
            card.appendChild(wind);
            card.appendChild(uvIndex);
            cardContainer.appendChild(card);
            currentEl.appendChild(cardContainer);
        });
}

function forecastSearch(search) {
    var forecastHeader = document.getElementById("forecast-header");
    forecastHeader.className = "";

    var forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    var api = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${apiKey}&units=imperial`;

    fetch(api)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var forecastEl = document.getElementById("forecast");

            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.includes("12:00:00")) {
                    var cards = document.createElement('div');

                    var cardContainer = document.createElement('div');
                    cardContainer.className = "card text-white";

                    var card = document.createElement('div');
                    card.className = "card-body";

                    var cardHeader = document.createElement('h3');
                    cardHeader.className = "card-title";
                    cardHeader.textContent = moment(data.list[i].dt_txt.split("12:")[0]).format("LL");
                    var temperature = document.createElement('p');
                    temperature.className = "card-text"
                    temperature.textContent = "Temperature : " + data.list[i].main.temp_max + "°F";

                    var humidity = document.createElement('p');
                    humidity.className = "card-text"
                    humidity.textContent = "Humidity : " + data.list[i].main.humidity + "%";

                    var icon = document.createElement('img');
                    icon.setAttribute('src', `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);

                    card.appendChild(cardHeader);
                    card.appendChild(icon);
                    card.appendChild(temperature);
                    card.appendChild(humidity);
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
            weatherSearch(event.target.textContent);
            forecastSearch(event.target.textContent);
        });
        document.getElementById("history").appendChild(historyItem);
    });
}