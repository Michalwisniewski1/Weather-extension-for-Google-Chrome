'use strict';

const api = 'dce2f1f90e95b4ee2aa26df33f05daaa';
let days;
let getTemps;
let getHighest;

let handleBoxSearch = () => {
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
            let container = document.querySelector('.container.responsive.border');
            container.style.display = 'none';
            /*get url to connect to JSON with weather infro for choosen city */
            navigator.geolocation.getCurrentPosition(function(getPosition) {
                let getUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + getPosition.coords.latitude + "&lon=" + getPosition.coords.longitude + "&appid=" + api;
                localStorage.setItem('GPSLOCATION', getUrl);
                /*get data from openweathermap API */
                let req = new XMLHttpRequest();
                req.open('GET', localStorage.getItem('GPSLOCATION'));
                req.onload = function() {
                    let status = req.status;
                    if (status == 200) {
                        let data = JSON.parse(req.responseText);
                        getWeatherInfo(data);
                        setTemperatures();
                    } else {
                        alert('Connection Error');
                    }
                };
                req.send();
            });
        } else {
            document.querySelector('.container.responsive').style.border = 'thin dotted red';
            console.log('Geolocation is not supported by your browser');
        }
    });
    if (localStorage.getItem('GPSLOCATION') !== null) {
        /*get data from openweathermap API */
        let req = new XMLHttpRequest();
        req.open('GET', localStorage.getItem('GPSLOCATION'));
        req.onload = function() {
            let status = req.status;
            if (status == 200) {
                let data = JSON.parse(req.responseText);
                getWeatherInfo(data);
                setTemperatures();
                getIcons();
                getHighestTemp();
                getLowestTemp();
                currentTemp();
            } else {
                alert('Connection Error');
            }
        };
        req.send();
    }
};

let App = () => {
    handleBoxSearch();
};

let getWeatherInfo = (data) => {
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
    return days;
};

let setTemperatures = () => {
    getTemps = Object.keys(days).map((key) => {
        let day = days[key];
        return Object.keys(day).map((index) => {
            let temp = day[index].main.temp;
            return parseInt(temp - 273.16);
        });
    });
    return getTemps;
};

let sortNumbers = (a, b) => {
    return a - b;
};

let getDate = (date) => {
    let today = new Date();
    today.setDate(today.getDate() + date);
    return today.getDate().toString().length < 2 ? "0" + today.getDate().toString() : today.getDate().toString();
};

let currentTemp = () => {
    let insertTemp = document.querySelector('.currentTemp');
    insertTemp.textContent = getTemps[0][0] + '°';
}

let getHighestTemp = () => {
    let tempSelectors = document.querySelectorAll('.maxTemp');
    let highestTemp = Array.prototype.map.call(getTemps, (highest) => {
        return highest.sort(sortNumbers).slice(-1)[0];
    });
    for (var i = 0; i < tempSelectors.length; i++) {
        tempSelectors[i].textContent = highestTemp[i + 1] + '°';
    }
};

let getLowestTemp = () => {
    let tempSelectors = document.querySelectorAll('.minTemp');
    let lowestTemp = Array.prototype.map.call(getTemps, (lowest) => {
        return lowest.sort(sortNumbers)[0];
    });
    for (var i = 0; i < tempSelectors.length; i++) {
        tempSelectors[i].textContent = lowestTemp[i + 1] + '°';
    }
    return lowestTemp;
};

let getRainInfo = () => {
    let dailyInfo = Object.keys(days).map((key) => {
        let element = days[key];
        return Object.keys(element).filter((index) => {
            let trueCondition = element[index].weather[0].description.match(/rain/);
            return trueCondition
        }).length / 8 * 100 + '%';
    });
    return dailyInfo;
};

let getIcons = () => {
    let setIcons = Array.prototype.map.call(getWeatherData(), function(element) {
        switch (element) {
            case 'thunderstorm with light rain':
            case 'thunderstorm with rain':
            case 'thunderstorm with heavy rain':
            case 'light thunderstorm':
            case 'thunderstorm':
            case 'heavy thunderstorm':
            case 'ragged thunderstorm':
            case 'thunderstorm with light drizzle':
            case 'thunderstorm with drizzle':
            case 'thunderstorm with heavy drizzle':
                return 'O';
                break;
            case 'light intensity drizzle':
            case 'drizzle':
            case 'heavy intensity drizzle':
            case 'light intensity drizzle rain':
            case 'drizzle rain':
            case 'heavy intensity drizzle rain':
            case 'shower rain and drizzle':
            case 'heavy shower rain and drizzle':
            case 'shower drizzle':
                return 'Q';
                break;
            case 'freezing rain':
            case 'light intensity shower rain':
            case 'shower rain':
            case 'heavy intensity shower rain':
            case 'ragged shower rain':
                return '8';
                break;
            case 'extreme rain':
            case 'very heavy rain':
            case 'heavy intensity rain':
            case 'moderate rain':
            case 'light rain':
                return 'R';
                break;
            case 'light snow':
            case 'snow':
            case 'heavy snow':
            case 'sleet':
            case 'light rain and snow':
            case 'rain and snow':
            case 'light shower snow':
            case 'shower snow':
            case 'heavy shower snow':
                return 'W';
                break;
            case 'mist':
            case 'smoke':
            case 'haze':
            case 'sand, dust whirls':
            case 'fog':
            case 'sand':
            case 'dust':
            case 'volcanic ash':
            case 'squalls':
            case 'tornado':
                return 'M';
                break;
            case 'clear sky':
                return 'B';
                break;
            case 'few clouds':
                return 'H';
                break;
            case 'scattered clouds':
            case 'broken clouds':
            case 'overcast clouds':
                return 'N';
                break;
            case 'tornado':
                return 'S';
                break;
            case 'tropical storm':
                return '!';
                break;
            case 'hurricane':
                return 'S';
                break;

            case 'hot':
                return ',';
                break;
            case 'windy':
                return 'F';
                break;
            case 'hail':
                return
            case 'cold':
                return 'G';
                break;
            default:
                return ')';
                break;
        }
    });
    let tempSelectors = document.querySelectorAll('.icon');

    for (var i = 0; i < tempSelectors.length; i++) {
        tempSelectors[i].textContent = setIcons[i + 1];
    }
};

let getWeatherData = () => {
    let currentTemp = document.querySelector('.currentConditions');
    let dailyInfo = Object.keys(days).map((key) => {
        let element = days[key];
        return sortArrByOccurence(Object.keys(element).map((index) => {
            return element[index].weather[0].description;
        }));
    });
    currentTemp.textContent = dailyInfo[0];
    return dailyInfo;
};

let getDayName = (day) => {
    let date = new Date();
    let namesOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (date.getDay()) > 6 ? namesOfDays[(date.getDay()) - 7] : namesOfDays[date.getDay() + day - 1];
};

let setDays = () => {
    let days = [1, 2, 3, 4, 5];
    let writeDays = days.map((day) => {
        return getDayName(day);
    });
    for (var i = 0; i < tempSelectors.length; i++) {
        tempSelectors[i].textContent = lowestTemp[i + 1] + '°';
    }
    return writeDays;
};


let sortArrByOccurence = (array) => {
    let elements = {};
    let maxEl = array[0],
        maxCount = 1;
    for (let i = 0; i < array.length; i++) {
        if (elements[array[i]] == null) {
            elements[array[i]] = 1;
        } else {
            elements[array[i]]++;
        }
        if (elements[array[i]] > maxCount) {
            maxEl = array[i];
            maxCount = elements[array[i]];
        }
    }
    return maxEl;
};

App();
