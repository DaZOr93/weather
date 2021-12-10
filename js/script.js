const apiKey = "25afb8e90d4240a88cb172551210612";
let weather;
if (!localStorage.getItem('city')) {
    localStorage.setItem('city', 'Краматорск')
}

function renderWeather() {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${localStorage.getItem('city')}&days=7&aqi=no&alerts=no&lang=ru`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            weather = data;
            currentWeather(weather.current);
            renderCity(weather);
            weatherHours(weather.forecast.forecastday[0]);
            forecastDay(weather.forecast);
        });
}

function currentWeather(obj) {
    let elementCurrentCity = document.querySelector('.current__description');
    let elementCurrenTemperature = document.querySelector('.current__temperature');
    let elementCurrenFeelsLike = document.querySelector('.feelsLike .details__value');
    let elementCurrenPressure = document.querySelector('.pressure .details__value');
    let elementCurrenHumidity = document.querySelector('.humidity .details__value');
    let elementCurrenWind = document.querySelector('.wind .details__value');
    elementCurrenTemperature.innerHTML = `${obj.temp_c} ˚`;
    elementCurrenTemperature.style.backgroundImage = `url("https:${obj.condition.icon}")`;
    elementCurrentCity.innerHTML = obj.condition.text;
    elementCurrenFeelsLike.innerHTML = `${obj.feelslike_c} ˚`;
    elementCurrenPressure.innerHTML = `${convertPressure(obj.pressure_mb)} мм. рт. ст.`;
    elementCurrenHumidity.innerHTML = `${obj.humidity} %`;
    elementCurrenWind.innerHTML = `${convertWind(obj.wind_kph)} м/с`;
}

function convertPressure(number) {
    return Math.round(number * 0.75);
}

function convertWind(wind_kph) {
    let windMs = wind_kph / 3.6;
    return windMs.toFixed(2);
}

function renderCity(obj) {
    let elementCurrentCity = document.querySelector('.current__city');
    elementCurrentCity.innerHTML = obj.location.name;
}

function weatherHours(obj) {
    let forecastDescription = document.querySelector('.forecast__description');
    forecastDescription.innerHTML = `Почасовой прогноз на ${obj.date}`;
    let elementWeatherHour = document.querySelectorAll('.forecast__item');
    for (let i = 0; i < 6; i++) {
        let forecastTime = elementWeatherHour[i].querySelector('.forecast__time');
        let forecastIcon = elementWeatherHour[i].querySelector('.forecast__icon');
        let forecastTemperature = elementWeatherHour[i].querySelector('.forecast__temperature');
        let weatherHour = obj.hour[i * 4];
        forecastTime.innerHTML = weatherHour.time.slice(weatherHour.time.length - 5);
        forecastIcon.style.backgroundImage = `url("https:${weatherHour.condition.icon}")`;
        forecastTemperature.innerHTML = `${weatherHour.temp_c} ˚`;
    }
}

function forecastDay(forecast) {
    let elementForecastDay = document.querySelectorAll('.forecast__day__item');
    for (let i = 0; i < 3; i++) {
        let forecastData = elementForecastDay[i].querySelector('.forecast__data');
        let forecastCondition = elementForecastDay[i].querySelector('.forecast__condition');
        let forecastTemperature = elementForecastDay[i].querySelector('.forecast__temperature');
        let forecastIcon = elementForecastDay[i].querySelector('.forecast__day__icon');
        forecastData.innerHTML = forecast.forecastday[i].date;
        forecastCondition.innerHTML = forecast.forecastday[i].day.condition.text;
        forecastTemperature.innerHTML = `${forecast.forecastday[i].day.mintemp_c} ˚ ${forecast.forecastday[i].day.maxtemp_c} ˚`;
        forecastIcon.style.backgroundImage = `url("https:${forecast.forecastday[i].day.condition.icon}")`;
        elementForecastDay[i].setAttribute("day", i);
    }
}

function selectWeatherDay(elm) {
    let activeDay = document.querySelector('.active');
    activeDay.classList.remove("active");
    let day = elm.getAttribute("day");
    weatherHours(weather.forecast.forecastday[day]);
    elm.classList.add("active");
}

function loadCiyList(elm) {
    let query = elm.value;
    fetch(`https://api.visicom.ua/data-api/4.0/ru/search/adm_settlement.json?text=${query}*&l=5&key=b26bad04104064b577b4f1e6b89cb590`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            addListCity(data);
        });
}

function addListCity(data) {
    let cityList = document.querySelector('#cityList');
    if ((!isEmpty(data)) && (data.type !== 'Feature')) {
        cityList.innerHTML = '';
        for (let i = 0; i < data.features.length; i++) {
            cityList.append(new Option(data.features[i].properties.name));
        }
    } else if (data.type === 'Feature') {
        cityList.innerHTML = '';
        cityList.append(new Option(data.properties.name));
    } else {
        cityList.innerHTML = '';
    }
}

function isEmpty(obj) {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false;
    }
    return true;
}

function closeCityEditor() {
    let cityEditor = document.querySelector('.cityEditor');
    cityEditor.style.display = 'none';
}

function openCityEditor() {
    let cityEditor = document.querySelector('.cityEditor');
    cityEditor.style.display = 'block';
}

function saveCity() {
    let city = document.querySelector('.selectCity').value;
    if(city){
        localStorage.setItem('city', city);
    }
    closeCityEditor()
    renderWeather()
}

renderWeather()