$(document).ready(function() {
  var api = 'dce2f1f90e95b4ee2aa26df33f05daaa';

  var App = function() {
    handleBoxSearch();
  };

  var handleBoxSearch = function() {
    var inputBox = document.getElementById('weatherSearch');
    var button = document.getElementById('clickToFind');
    button.addEventListener('click', function() {
      if (inputBox.value !== '') {
        city = inputBox.value;
        /*get url to connect to JSON with weather infro for choosen city */
        var url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=dce2f1f90e95b4ee2aa26df33f05daaa";
        /*get data from openweathermap API */
        $.ajax({
          url: url,
          dataType: 'json',
          success: getWeatherInfo,
          error: function(err) {
            console.log('ERROR: ' + err);
          }
        });
      } else {
        document.querySelector('.container.responsive').style.border = 'thin dotted red'
        console.log('Type correct name of city');
      }
    });
  };

  var getWeatherInfo = function(data) {
    var city = data.city.name;
    var country = data.city.country;
    var list = data.list;
    var today = [];
    var tomorrow = [];
    var thirdDay = [];
    var fourthDay = [];
    var fivethDay = [];
    var lastDay = [];
    console.log(list);
    /*Iterate in array of objects and sort it by date */
    for (var i = 0; i < list.length; i++) {
      switch (list[i].dt_txt.match(/-(\d+)(?!.*\-d?)/)[1]) {
        case getDate(0):
          today.push(list[i])
          break;
        case getDate(1):
          tomorrow.push(list[i])
          break;
        case getDate(2):
          thirdDay.push(list[i])
          break;
        case getDate(3):
          fourthDay.push(list[i])
          break;
        case getDate(4):
          fivethDay.push(list[i])
          break;
        case getDate(5):
          lastDay.push(list[i])
          break;
      }
    }

    /* Data of today*/
    setTemperature(today);
    getDayName(0);
    getWeatherConditions(today);
    sortArrByOccurence(getWeatherConditions(today));

    /*Data of tomorrow */
    setTemperature(tomorrow);
    getDayName(1);
    getWeatherConditions(tomorrow);
    sortArrByOccurence(getWeatherConditions(today));

    /*Data of thirdDay*/
    setTemperature(thirdDay);
    getDayName(2);
    getWeatherConditions(thirdDay);
    sortArrByOccurence(getWeatherConditions(today));

    /*Data of fourthDay*/
    setTemperature(fourthDay);
    getDayName(3);
    getWeatherConditions(fourthDay);
    sortArrByOccurence(getWeatherConditions(today));

    /*Data of fivethDay*/
    setTemperature(fivethDay);
    getDayName(4);
    getWeatherConditions(fivethDay);
    sortArrByOccurence(getWeatherConditions(today));


    /*Data of lastDay*/
    if (lastDay.length > 0) {
      setTemperature(lastDay);
      getDayName(5);
      getWeatherConditions(lastDay);
    }
  };

  var addArrayValues = function(a, b) {
    return a + b;
  };

  var sortNumbers = function(a, b) {
    return a - b;
  };

  var getDate = function(date) {
    var today = new Date();
    today.setDate(today.getDate() + date);
    return today.getDate().toString().length < 2 ? "0" + today.getDate().toString() : today.getDate().toString();
  };

  var setTemperature = function(arr) {
    var sumTemp;
    var getTemps = arr.map(function(temp) {
      return parseInt(temp.main.temp - 273.16);
    });
    sumTemp = getTemps.reduce(addArrayValues);
    sumTemp = ((sumTemp / getTemps.length) - 273.16).toFixed(2);
    var highestTemp = getTemps.sort(sortNumbers).slice(-1)[0];
    var lowestTemp = getTemps.sort(sortNumbers)[0];
  };

  var getWeatherConditions = function(arr) {
    var info;
    var getInfo = arr.map(function(data) {
      return data.weather[0].description;
    });
    return getInfo;
  };

  var getDayName = function(day) {
    var date = new Date();
    var namesOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (date.getDay() + day) > 6 ? namesOfDays[(date.getDay() + day) - 7] : namesOfDays[date.getDay() + day];
  };

  var sortArrByOccurence = function(array) {
    if (array.length == 0)
      return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  };


  App();
});
