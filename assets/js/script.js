var apiKey = "768d8906dffdb8442fb5b977a6c0b4ff";

// Search City/History 
var searchHistory;
if(JSON.parse(localStorage.getItem("history")) != null)
    searchHistory = JSON.parse(localStorage.getItem("history"));
else    
    searchHistory = [];

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchResults);

searchList();

function searchResults() {
    var search = document.getElementById("search").value;
    if (document.getElementById("search").value !== "") {

        currentWeather(search);
        forecastSearch(search);

        saveSearch(search);
        renderSearch();

        document.getElementById("search").value = "";
    }
}

