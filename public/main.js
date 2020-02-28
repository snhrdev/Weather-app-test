document.addEventListener('DOMContentLoaded', function() {
  const geo = {};
  // Get Geolocation
  function fetchGeo() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        geo.lat = position.coords.latitude;
        geo.lon = position.coords.longitude;
        document.querySelector('#lat').textContent = geo.lat.toFixed(2);
        document.querySelector('#lon').textContent = geo.lon.toFixed(2);
        fetchWeather();
      });
    } else {
      console.log('Bad news..., geolocation is not working');
    }
  }
  // Get weather information from api
  async function fetchWeather() {
    const response = await fetch(`/weather/${geo.lat},${geo.lon}`);
    const data = await response.json();
    const weather = data.weather;

    const temperature = (
      ((weather.currently.temperature - 32) * 5) /
      9
    ).toFixed(1);
    const infoWeather = document.querySelector('#weatherInfo');
    infoWeather.textContent = `The weather in ${weather.timezone} is currently ${weather.currently.summary} with a temperature of ${temperature} °C`;

    if (data.aq) {
      document.querySelector(
        '#aqInfo'
      ).textContent = `The Air quality is ${data.aq.value} ${data.aq.unit}`;
    } else {
      document.querySelector('#aqInfo').textContent =
        'Air quality not available';
    }
  }
  // Add weather information from api
  async function addWeather() {
    const response = await fetch('/weather-add');
    const data = await response.text();
  }
  fetchGeo();
  document
    .querySelector('#btn_addWeather')
    .addEventListener('click', addWeather);
});
