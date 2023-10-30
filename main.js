const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeatherButton');
const cityList = document.getElementById('cityList');
const selectedCityWeather = document.getElementById('selectedCityWeather');
const elementCount = document.getElementById('elementCount');


let savedCities = JSON.parse(sessionStorage.getItem('savedCities'));// valoarea stocata sub key
if (!savedCities) {
    savedCities = []; // daca nu este nici o valoare salvata, atunci initializam ca un array gol
}

console.log(savedCities);

function showSavedCities() {
    if (savedCities && Array.isArray(savedCities)) {
        cityList.innerHTML = ''; // curatam lista inainte de a o crea

        savedCities.forEach(city => {
            const cityLink = document.createElement('a');
            cityLink.textContent = city;
            cityLink.setAttribute('href', '#'); //Valoarea '#' => link-ul este setat sa conduca la o ancora goala
            cityLink.addEventListener('click', (event) => {

                getWeather(city);
            });

            const cityItem = document.createElement('li');
            cityItem.appendChild(cityLink);
            cityList.appendChild(cityItem);
        });
    // const elementCount = document.getElementById('elementCount');
    elementCount.textContent = `Nr de elem: ${savedCities.length}`;
    // sessionStorage.setItem('elementCount', savedCities.length);

    }
    cityInput.disabled = false; //activeaza bara de cautare
    getWeatherButton.disabled = false; // activeaza butonul de cautare
}

showSavedCities();

getWeatherButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '' && city !== null) {

//verificam daca orasul este valid inainte de al introduce in lista
        checkCityValidity(city)
            .then(isValid => {
                if (isValid) {
                    savedCities.push(city);
                    sessionStorage.setItem('savedCities', JSON.stringify(savedCities));
                    const cityItem = document.createElement('li');
                    cityItem.textContent = city;
                    cityList.appendChild(cityItem);
                    cityInput.value = '';

                    cityItem.addEventListener('click', () => {
                        getWeather(city);
                    });

                    // const elementCount = document.getElementById('elementCount');
                    elementCount.textContent = `Nr de elem: ${savedCities.length}`;
                    sessionStorage.setItem('elementCount', savedCities.length);
                    showSavedCities();
                } else {
                    alert('Orasul nu exista sau este invalid');
                }
            })
           
    } else {
        alert('Introdu un oras');
    }
});

async function getWeather(city) {
    const apiKey = 'd641eb66efbcb6598010a4fa9ebebc4e';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ro`;

    const response = await fetch(apiUrl);

    if (response.status === 200) {
        const data = await response.json();

        const weatherInfo = `
            <h2>Vremea in ${data.name}, ${data.sys.country}</h2>
            <p>Temperatura: ${data.main.temp} °C</p>
            <p>Umiditate: ${data.main.humidity}%</p>
            <p>Descriere: ${data.weather[0].description}</p>
        `;
        selectedCityWeather.innerHTML = weatherInfo;

        // weatherData.style.display = 'block';
        // weatherData.innerHTML = weatherInfo;
    } else {
        alert('Orasul nu exista');
    }
    cityInput.disabled = true;
    getWeatherButton.disabled = true;
}

async function checkCityValidity(city) {
    const apiKey = 'd641eb66efbcb6598010a4fa9ebebc4e'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ro`;

    const response = await fetch(apiUrl);

    if (response.status === 200) {
        return true; // orasul este valid
    } else {
        return false; // orasul este invalid
    }
}

const resetListButton = document.getElementById('resetListButton');

resetListButton.addEventListener('click', () => {
    savedCities = []; 
    selectedCityWeather.innerHTML = '';
    sessionStorage.removeItem('savedCities'); 
    showSavedCities(); 

});
