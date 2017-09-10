const api = 'dce2f1f90e95b4ee2aa26df33f05daaa';
let days;
let getTemps;
let getHighest;

function handleBoxSearch() {
    const inputBox = document.getElementById('weatherSearch');
    const button = document.getElementById('clickToFind');
    const gpsButton = document.getElementById('getGPSlocation');
    let city;
    let url;

    button.addEventListener('click', () => {
        if (inputBox.value !== '') {
            city = inputBox.value;
            /*get url to connect to JSON with weather infro for choosen city */
            url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + api;
            /*get data from openweathermap API */
            let req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function() {
                let status = req.status;
                if (status == 200) {
                    let data = JSON.parse(req.responseText);
                    getWeatherInfo(data);
                    console.log(data);
                } else {
                    alert('Connection Error');
                }
            };
            req.send();
        } else {
            document.querySelector('.container.responsive').style.border = 'thin dotted red';
            console.log('Type correct name of city');
        }
        console.log(url);

    });

    gpsButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            var container = document.querySelector('.container.responsive.border');
            container.style.display = 'none';
            /*get url to connect to JSON with weather infro for choosen city */
            navigator.geolocation.getCurrentPosition(function(getPosition) {
                var getUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + getPosition.coords.latitude + "&lon=" + getPosition.coords.longitude + "&appid=" + api;
                localStorage.setItem('GPSLOCATION', getUrl);
            });
            /*get data from openweathermap API */
            var req = new XMLHttpRequest();
            req.open('GET', localStorage.getItem('GPSLOCATION'));
            req.onload = function() {
                var status = req.status;
                if (status == 200) {
                    var data = JSON.parse(req.responseText);
                    getWeatherInfo(data);
                    setTemperatures();
                } else {
                    alert('Connection Error');
                }
            };
            req.send();
        } else {
            document.querySelector('.container.responsive').style.border = 'thin dotted red';
            console.log('Geolocation is not supported by your browser');
        }
    });
};

function App() {
    handleBoxSearch();
};

function getWeatherInfo(data) {
    let givenCity = data.city.name;
    let country = data.city.country;
    let list = data.list;
    console.log(list);
    days = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
    };
    const arrayWithData = list.filter((result, day) => {
        let el = result.dt_txt.match(/-(\d+)(?!.*\-d?)/)[1];
        switch (el) {
            case getDate(0):
                {
                    days[0].push(list[day]);
                    break;
                }
            case getDate(1):
                {
                    days[1].push(list[day]);
                    break;
                }
            case getDate(2):
                {
                    days[2].push(list[day]);
                    break;
                }
            case getDate(3):
                {
                    days[3].push(list[day]);
                    break;
                }
            case getDate(4):
                {
                    days[4].push(list[day]);
                    break;
                }
        }
    });
    console.table(days);
    return days;
};

function setTemperatures() {
    var insertTemp = document.querySelector('.currentWeather');
    getTemps = Object.keys(days).map((key) => {
        let day = days[key];
        return Object.keys(day).map((index) => {
            let temp = day[index].main.temp;
            return parseInt(temp - 273.16);
        });
    });
    return getTemps;
};

function sortNumbers(a, b) {
    return a - b;
};

function getDate(date) {
    let today = new Date();
    today.setDate(today.getDate() + date);
    return today.getDate().toString().length < 2 ? "0" + today.getDate().toString() : today.getDate().toString();
};

function getHighestTemp() {

    return data.sort(sortNumbers).slice(-1)[0];
};

function getLowestTemp(data) {
    return data.sort(sortNumbers)[0];
};

function getWeatherConditions(arr) {
    var getInfo = arr.map(function(element) {
        return element;
    });
    return getInfo;
};

function getRainInfo(data, arr) {
    var rain = [];
    data.map(function(data) {
        if (data.weather[0].description.match(/rain/) !== null) {
            rain.push(data);
        }
    });
    return parseInt((rain.length / data.length) * 100) + '%';
};

function getDayName(day) {
    let date = new Date();
    let namesOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (date.getDay() + day) > 6 ? namesOfDays[(date.getDay() + day) - 7] : namesOfDays[date.getDay() + day];
};

function sortArrByOccurence(array, data) {
    if (array.length == 0)
        return null;
    var elements = {};
    var maxEl = array[0],
        maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (elements[el] == null)
            elements[el] = 1;
        else
            elements[el]++;
        if (elements[el] > maxCount) {
            maxEl = el;
            maxCount = elements[el];
        }
    }
    return maxEl;
};

App();