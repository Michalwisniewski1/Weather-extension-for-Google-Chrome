var api = 'dce2f1f90e95b4ee2aa26df33f05daaa';

var handleBoxSearch = function() {
    var inputBox = document.getElementById('weatherSearch');
    var button = document.getElementById('clickToFind');
    var gpsButton = document.getElementById('getGPSlocation');
    var city;
    var url;

    button.addEventListener('click', function() {
        if (inputBox.value !== '') {
            city = inputBox.value;
            /*get url to connect to JSON with weather infro for choosen city */
            url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + api;
            /*get data from openweathermap API */
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function() {
                var status = req.status;
                if (status == 200) {
                    var data = JSON.parse(req.responseText);
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

    gpsButton.addEventListener('click', function() {
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
                    console.log(data);
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

var App = function() {
    handleBoxSearch();
};

var getWeatherInfo = function(data) {
    var givenCity = data.city.name;
    var country = data.city.country;
    var list = data.list;
    var today = [];
    var tomorrow = [];
    var thirdDay = [];
    var fourthDay = [];
    var fivethDay = [];
    var lastDay = [];
    /*Iterate in array of objects and sort it by date */
    for (var i = 0; i < list.length; i++) {
        switch (list[i].dt_txt.match(/-(\d+)(?!.*\-d?)/)[1]) {
            case getDate(0):
                today.push(list[i]);
                break;
            case getDate(1):
                tomorrow.push(list[i]);
                break;
            case getDate(2):
                thirdDay.push(list[i]);
                break;
            case getDate(3):
                fourthDay.push(list[i]);
                break;
            case getDate(4):
                fivethDay.push(list[i]);
                break;
            case getDate(5):
                lastDay.push(list[i]);
                break;
        }
    }

    if (today.length > 1) {
        /* Data of today*/
        getDayName(0);
        getWeatherConditions(today);
        getRainInfo(today);
        /*getHighestTemp*/
        setTemperature(tomorrow).sort()[tomorrow.length - 1];
        /*getLowestTemp*/
        setTemperature(tomorrow).sort()[0];

    } else {
        /*Data of now*/
        getDayName(0);
        getWeatherConditions(today)[0];
        getRainInfo(getWeatherConditions(today))[0];
        setTemperature(today)[0];
    }

    /*Data of tomorrow */
    getDayName(1);
    getWeatherConditions(tomorrow);
    sortArrByOccurence(getWeatherConditions(tomorrow));
    getRainInfo(getWeatherConditions(tomorrow));
    getHighestTemp(setTemperature(tomorrow));
    getLowestTemp(setTemperature(tomorrow));

    /*Data of thirdDay*/
    getDayName(2);
    getWeatherConditions(thirdDay);
    sortArrByOccurence(getWeatherConditions(thirdDay));
    getRainInfo(getWeatherConditions(thirdDay));
    getHighestTemp(setTemperature(thirdDay));
    getLowestTemp(setTemperature(thirdDay));

    /*Data of fourthDay*/
    getDayName(3);
    getWeatherConditions(fourthDay);
    sortArrByOccurence(getWeatherConditions(fourthDay));
    getRainInfo(getWeatherConditions(fourthDay));
    getHighestTemp(setTemperature(fourthDay));
    getLowestTemp(setTemperature(fourthDay));

    /*Data of fivethDay*/
    getDayName(4);
    getWeatherConditions(fivethDay);
    sortArrByOccurence(getWeatherConditions(fivethDay));
    getRainInfo(getWeatherConditions(fivethDay));
    getHighestTemp(setTemperature(fivethDay));
    getLowestTemp(setTemperature(fivethDay));


    /*Data of lastDay*/
    if (lastDay.length > 0) {
        getDayName(5);
        getWeatherConditions(lastDay);
        sortArrByOccurence(getWeatherConditions(lastDay));
        getRainInfo(getWeatherConditions(lastDay));
        getHighestTemp(setTemperature(lastDay));
        getLowestTemp(setTemperature(lastDay));
    }
};

var sortNumbers = function(a, b) {
    return a - b;
};

var getDate = function(date) {
    var today = new Date();
    today.setDate(today.getDate() + date);
    return today.getDate().toString().length < 2 ? "0" + today.getDate().toString() : today.getDate().toString();
};

var setTemperature = function(arr, day) {
    var getTemps = arr.map(function(temp) {
        return parseInt(temp.main.temp - 273.16);
    });
    return getTemps;
};

var getHighestTemp = function(data) {
    return data.sort(sortNumbers).slice(-1)[0];
};

var getLowestTemp = function(data) {
    return data.sort(sortNumbers)[0];
};

var getWeatherConditions = function(arr) {
    var getInfo = arr.map(function(data) {
        return data;
    });
    return getInfo;
};

var getRainInfo = function(data, arr) {
    var rain = [];
    data.map(function(data) {
        if (data.weather[0].description.match(/rain/) !== null) {
            rain.push(data);
        }
    });
    return parseInt((rain.length / data.length) * 100) + '%';
};

var getDayName = function(day) {
    var date = new Date();
    var namesOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (date.getDay() + day) > 6 ? namesOfDays[(date.getDay() + day) - 7] : namesOfDays[date.getDay() + day];
};

var sortArrByOccurence = function(array, data) {
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
