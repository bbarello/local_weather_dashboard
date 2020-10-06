
$(document).ready(function(){
    $("button").click(function(event){
        event.preventDefault();
    });
});

function initPage() {
    var input = document.getElementById("city-input");
    var search = document.getElementById("search-button");
    var name = document.getElementById("city-name");
    var currentPic = document.getElementById("current-pic");
    var currentTemp = document.getElementById("temperature");
    var currentHumidity = document.getElementById("humidity");4
    var currentWind = document.getElementById("wind-speed");
    var currentUV = document.getElementById("UV-index");
    var history = document.getElementById("history");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];  
    var preventDefault;


    var APIKey = "7ad9a1c1847ed856b40b5b7c6a293117";
//  When search button is clicked, read the city name typed by the user

    function getWeather(cityName) {
//  Using saved city name, execute a current condition get request from open weather map api
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
        .then(function(response){

//  Parse response to display current conditions
        //  Method for using "date" objects obtained from https://devoper.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            var currentDate = new Date(response.data.dt*1000);
            console.log(currentDate);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            var weatherPic = response.data.weather[0].icon;
            currentPic.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPic.setAttribute("alt",response.data.weather[0].description);
            currentTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        var lat = response.data.coord.lat;
        var lon = response.data.coord.lon;
        var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        axios.get(UVQueryURL)
        .then(function(response){
            var UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge orange");
            UVIndex.innerHTML = response.data[0].value;
            currentUV.innerHTML = "UV Index: ";
            currentUV.append(UVIndex);
        });
//  Using saved city name, execute a 5-day forecast get request from open weather map api
        var cityID = response.data.id;
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        axios.get(forecastQueryURL)
        .then(function(response){

//  Parse response to display forecast for next 5 days underneath current conditions
            var forecasts = document.querySelectorAll(".forecast");
            for (i=0; i<forecasts.length; i++) {
                forecasts[i].innerHTML = "";
                var forecastIndex = i*8 + 4;
                var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();
                var forecastDate = document.createElement("p");
                forecastDate.setAttribute("class","mt-3 mb-0 forecast-date");
                forecastDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecasts[i].append(forecastDate);
                var forecastWeather = document.createElement("img");
                forecastWeather.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeather.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                forecasts[i].append(forecastWeather);
                var forecastTemp = document.createElement("p");
                forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                forecasts[i].append(forecastTemp);
                var forecastHumidity = document.createElement("p");
                forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecasts[i].append(forecastHumidity);
                }
            })
        });  
    }


    search.addEventListener("click",function() {
        var searchTerm = input.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderSearchHistory() {
        history.innerHTML = "";
        for (var i=0; i<searchHistory.length; i++) {
            var historyItem = document.createElement("input");
            // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }


//  Save user's search requests and display them underneath search form
//  When page loads, automatically generate current conditions and 5-day forecast for the last city the user searched for

}
initPage();