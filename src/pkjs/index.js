// https://home.openweathermap.org/api_keys
var myAPIKey = 'CHANGEME';

var xhrRequest = function(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos) {
  var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
      pos.coords.latitude + '&lon=' + pos.coords.longitude + '&units=metric&appid=' + myAPIKey;
  
  xhrRequest(url, 'GET', function(responseText) {
    // response Text contains a JSON Object with weather info
    var json = JSON.parse(responseText);
    
    var temperature = json.main.temp;
    console.log('Temperature is ' + temperature);
    
    var conditions = json.weather[0].main;
    console.log('Conditions are ' + conditions);
    
    var dictionary = {
      'TEMPERATURE': temperature,
      'CONDITIONS': conditions
    };
    
    // Send to Pebble
    Pebble.sendAppMessage(dictionary,
      function(e) {
        console.log('Weather info sent to Pebble successfully!');
      },
      function(e) {
        console.log('Error sending weather info to Pebble!');
      }
    );

  });
}

function locationError(err) {
  console.log('Error requesting location!');
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready', function (e) {
  console.log('PebbleKit JS ready!');
  
  // Get the initial weather
  getWeather();
});

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage', function(e) {
  console.log('AppMessage received!');
  getWeather();
});
