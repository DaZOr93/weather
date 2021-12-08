const apiKey = "25afb8e90d4240a88cb172551210612";
let city = "Краматорск";

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no&lang=ru`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        console.log(data);
        currentWeather(data.current);
        renderCity(data);
        weatherHours(data.forecast.forecastday[0]);
        forecastDay(data.forecast);
    });
function currentWeather(obj){
    let elementCurrentCity = document.querySelector('.current__description');
    let elementCurrenTemperature = document.querySelector('.current__temperature');
    let elementCurrenFeelslike = document.querySelector('.feelslike .details__value');
    let elementCurrenPressure = document.querySelector('.pressure .details__value');
    let elementCurrenHumidity = document.querySelector('.humidity .details__value');
    let elementCurrenWind = document.querySelector('.wind .details__value');
    elementCurrenTemperature.innerHTML = `${obj.temp_c} ˚`;
    elementCurrenTemperature.style.backgroundImage = `url("https:${obj.condition.icon}")`
    elementCurrentCity.innerHTML = obj.condition.text;
    elementCurrenFeelslike.innerHTML = `${obj.feelslike_c} ˚`;
    elementCurrenPressure.innerHTML = `${convertPressure(obj.pressure_mb)} мм. рт. ст.`;
    elementCurrenHumidity.innerHTML = `${obj.humidity} %`
    elementCurrenWind.innerHTML = `${convertWind(obj.wind_kph)} м/с`

}
function convertPressure(number){
    return Math.round(number*0.75);
}
function convertWind(wind_kph){
    let windMs = wind_kph/3.6;
    return windMs.toFixed(2);
}

function renderCity(obj){
    let elementCurrentCity = document.querySelector('.current__city');
    elementCurrentCity.innerHTML = obj.location.name;
}
function weatherHours(obj){
    let forecastDescription = document.querySelector('.forecast__description');
    forecastDescription.innerHTML =  `Почасовой прогноз на ${obj.date}`;
    let elementWeatherHour = document.querySelectorAll('.forecast__item');
    for (let i= 0; i< 6; i++){
    let forecastTime = elementWeatherHour[i].querySelector('.forecast__time');
    let forecastIcon = elementWeatherHour[i].querySelector('.forecast__icon');
    let forecastTemperature = elementWeatherHour[i].querySelector('.forecast__temperature');
    let  weatherHour = obj.hour[i*4];
    forecastTime.innerHTML = weatherHour.time.slice(weatherHour.time.length - 5);
    forecastIcon.style.backgroundImage = `url("https:${weatherHour.condition.icon}")`;
    forecastTemperature.innerHTML = `${weatherHour.temp_c} ˚`;
    }
}
function forecastDay(forecast){
    let elementForecastDay = document.querySelectorAll('.forecast__day__item');
    for (let i = 0; i<3; i++){
        let forecastData = elementForecastDay[i].querySelector('.forecast__data');
        let forecastCondition = elementForecastDay[i].querySelector('.forecast__condition');
        let forecastTemperature = elementForecastDay[i].querySelector('.forecast__temperature');
        let forecastIcon = elementForecastDay[i].querySelector('.forecast__day__icon')
        forecastData.innerHTML = forecast.forecastday[i].date;
        forecastCondition.innerHTML = forecast.forecastday[i].day.condition.text;
        forecastTemperature.innerHTML = `${forecast.forecastday[i].day.mintemp_c} ˚ ${forecast.forecastday[i].day.maxtemp_c} ˚`;
        forecastIcon.style.backgroundImage = `url("https:${forecast.forecastday[i].day.condition.icon}")`;
    }
}