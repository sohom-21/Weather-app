const searchInput = document.querySelector(".search-input");
const searchLocation = document.querySelector(".location-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const hourlyWeatherDiv = document.querySelector(".hourly_weather .weather-list");

const API_key = "4bc70e3f1615428199540907240809";


// Weather Codes for weather icons for the display to be updated
const weatherCodes = {
         clear: [1000],
         clouds: [1003, 1006, 1009],
         mist: [1030, 1135, 1147],
         rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
         moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1264],
         snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
         thunder: [1087, 1279, 1282],
         thunder_rain: [1273, 1276],
}

const displayHourlyForecast = (hourlyData) => {
         const currentHour = new Date().setMinutes(0,0,0);
         const next24Hours = currentHour+24*60*60*1000;

         // filter the hourly data to only include the next 24 hours
         const next24HoursData = hourlyData.filter(({time})=>{
                  const forecastTime=new Date(time).getTime();
                  return ((forecastTime >= currentHour)&&(forecastTime <= next24Hours));
         })

         // Generate HTML for each hourly forecast and display Hourly Forecast
         hourlyWeatherDiv.innerHTML = next24HoursData.map((item)=>{
                  const temperature = Math.floor(item.temp_c);
                  const time = new Date(item.time);
                  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  // console.log(item.condition.code);

                  const weatherIcon= Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));

                  return `<li class="weather-items">
                              <p class="time">${formattedTime}</p>
                              <img src="icons/${weatherIcon}.svg" alt="" class="weather_icon">
                              <p class="temperature">${temperature}°</p>
                           </li>`
         }).join("");
         // console.log(hourlyWeatherHTML); 
         console.log(next24HoursData);
}

const getWeatherDetails = async (API_URL) => {
         window.innerWidth <= 768 && searchInput.blur();
         // const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${cityName}&days=2`;
         try {
                  // fetching weather data from the api and parse it into json as response
                  const response = await fetch(API_URL);
                  const data = await response.json();

                  //extract weather data
                  const temperature = Math.floor(data.current.temp_c);
                  const description = data.current.condition.text;
                  const weatherIcon= Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));
                  console.log(weatherIcon);

                  // update the current weather display 
                  currentWeatherDiv.querySelector(".weather_icon").src = `icons/${weatherIcon}.svg`;
                  currentWeatherDiv.querySelector(".temperature").innerHTML = `${temperature}<span>°C</span>`;
                  currentWeatherDiv.querySelector(".description").innerText = description;

                  // update hourly weather forcast
                  const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour]
                  displayHourlyForecast(combinedHourlyData);

                  
                  searchInput.value = data.location.name;
                  console.log(data);
         } catch (error) {
                  console.log(error);
         }
}
 
// set up weather request for a specific city
const setupWeatherRequest = (cityName) => {
         const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${cityName}&days=2`;
         getWeatherDetails(API_URL);
}

searchInput.addEventListener("keyup", (e) => {
         const cityName = searchInput.value.trim();
         if (e.key === "Enter" && cityName) {
                  setupWeatherRequest(cityName);
         }
})

searchLocation.addEventListener("click", () => {
         navigator.geolocation.getCurrentPosition(position => {
                  const {latitude, longitude} = position.coords;
                  const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${latitude},${longitude}&days=2`;
                  getWeatherDetails(API_URL);
              console.log(position)    
         }, error =>{
                  alert("location access denied. please enable permission to use this feature.")
         });
})