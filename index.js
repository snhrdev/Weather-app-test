const express = require('express');
const fetch = require('node-fetch');
const app = express();
const Datastore = require('nedb');
const db = new Datastore('./database.db');

require('dotenv').config();

const port = env.process.PORT || 3000;
app.listen(port, () => {
  console.log(`Weather app started on port ${port}`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

let currentGeo = {};
db.loadDatabase();

app.get('/weather/:geo', async (req, res) => {
  const geo = req.params.geo.split(',');
  const lat = geo[0];
  const lon = geo[1];

  // weather api
  const api_key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${api_key}/`;
  const weather_response = await fetch(`${weather_url}${lat},${lon}`);
  const weather_data = await weather_response.json();

  // Air Quality api
  const aq_url = 'https://api.openaq.org/v1/latest?coordinates=';
  const aq_response = await fetch(`${aq_url}${lat},${lon}`);
  const aq_data = await aq_response.json();
  const aq = aq_data.results[0] ? aq_data.results[0].measurements[0] : false;

  const data = {
    weather: weather_data,
    aq: aq
  };
  currentGeo = data;
  res.json(data);
});

app.get('/weather-add', (req, res) => {
  const aq = false
    ? 'No air quality data'
    : `Air quality: ${currentGeo.aq.value} ${currentGeo.aq.unit}`;
  const dataset = {
    timezone: currentGeo.weather.timezone,
    latitude: currentGeo.weather.latitude,
    longitude: currentGeo.weather.longitude,
    time: currentGeo.weather.currently.time,
    temperature: currentGeo.weather.currently.temperature,
    aq: aq
  };
  db.insert(dataset);
  res.send('success');
});

app.get('/data', (req, res) => {
  db.find({}, (err, data) => {
    res.json(data);
  });
});
