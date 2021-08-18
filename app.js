//Get elements from html doc to change
let temp_doc = document.querySelector('.temperature');
let city_doc = document.querySelector('.city');
let country_doc = document.querySelector('.country');
//get search boc element
const searchbox = document.querySelector('.search-box');
//Open Weather API KEY 
const api_key = 'PASTE YOUR API KEY HERE';
//event listener for Enter key to submit custom location
searchbox.addEventListener('keypress', setQuery);
//Boolean to check if Custom Location or automatic location
let custom_location = false;
//Fucntion to submit custom location and get its weather data
function setQuery(evt) {
    if (evt.keyCode == 13)
    {
        //call function to get weather data for custom location
        getResults(searchbox.value);
    }
}
//function to get weather data of given location
function getResults (query) {
    //base URL for API usin location name
    let api = "http://api.openweathermap.org/data/2.5/weather?q="
    //fetch api data for location
    fetch(`${api}${query}&appid=${api_key}`)
    .then(weather => {
        //since custom location was submitted set boolean to true
        custom_location = true;
        //return json of weather data
        return weather.json();
    }).then(displayResults); //Send weather data as json to displayResults function
}
//function to change the html and display results
function displayResults (data) 
{
    //print data to console **FOR TESTING** 
    console.log(data);
    //Get current temperature data from weather json
    const current_temp = data.main['temp'];
    //convert current temperature from Kelvin to Fahrenheit
    var temp_F = Math.round((current_temp-273.15)*(9/5)+32);
    //Get current city name and cast it as a string variable
    const city = String(data.name);
    //Get current country of given city
    const country = data.sys['country'];
    //Get the weather id to change the background later less than 800 means not sunny
    const weather_type = data.weather["0"].id;
    //Replace html elements text content with weather data
    temp_doc.textContent = temp_F +" °F";
    city_doc.textContent = city;
    country_doc.textContent = country;
    //Call function to change background based on weather ID
    change_bg(weather_type);

}

//Check if using users current location or custom location
if (custom_location == false)
{
    //Check if browser supports geo location
    if (navigator.geolocation)
    {
    //alert('Yup the browsers good enough');
    navigator.geolocation.getCurrentPosition(function(pos)
    {
        //get users longitude and latitude to show their current location
        let geoLat = pos.coords.latitude.toFixed(5);
        let geoLng = pos.coords.longitude.toFixed(5);
        //cal function to get weather data using users current location
        get_weather_lat_lng(geoLat, geoLng);
    });
    }
    //Tell user that their browser doesn't support geolocation
    else
    {
        alert('You\'re gonna need a new browser');
    }
}
//function to call the API using longitude and latitude
function get_weather_lat_lng(lat, lng)
{
    //API url to get users location using longitude and latitude
    const openweather = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`;
    //get weather data using API
    fetch(openweather)
            .then(data =>{
                return data.json();
            }).then(data =>{
                console.log(data);
                //call function to display weather data and pass in the data as a json
                displayResults(data);
            })
}
//function to change the background based on weather type and time of day
function change_bg(clouds)
{
    //get the current time in hours
    const hours = new Date().getHours();
    //boolean to check if day time
    const isDayTime = hours > 6 && hours < 20;
    //check if sunny
    if (clouds >= 800)
    {
        //check if day time
        if (isDayTime)
        {
            //change background to daytime clear sky gif
            document.querySelector('.bg-img').style.backgroundImage="url(https://data.whicdn.com/images/197123132/original.gif)";
        }
        //if night time
        else
        {
            //change background to nightime clear sky gif
            document.querySelector('.bg-img').style.backgroundImage="url(https://64.media.tumblr.com/6014f3a4a4ab8e878622d7ad75dc1ed0/tumblr_o4nfsrKXjL1txt22yo1_500.gif)";
        }
        
    }
    //not sunny
    else 
    {
        //check if day time
        if (isDayTime)
        {
            //change background to cloudy day gif
            document.querySelector('.bg-img').style.backgroundImage="url(https://media.giphy.com/media/vLi3T5m3RH45y/giphy.gif)";
        }
        //if night time
        else
        {
            //change background to cloudy night gif
            document.querySelector('.bg-img').style.backgroundImage="url(https://i.pinimg.com/originals/1c/61/14/1c61140e5941e12f63f22877d627c38e.gif)";
        }
    }
}