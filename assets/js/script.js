var apiKey = "768d8906dffdb8442fb5b977a6c0b4ff";

// Search City/History 
var searchHistory;
if(JSON.parse(localStorage.getItem("history")) != null)
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

        document.getElementById("search").value = "";
    }
}


function currentWeather(search) {
    var currentDay = document.getElementById("current-day");
    currentDay.className = "";

    var currentApi = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;
    
    fetch(currentApi)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var currentEl = document.getElementById("current");
        currentEl.textContent = "";
    })
}
