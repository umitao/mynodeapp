const express = require("express");
const app = express();
const formidableMiddleware = require("express-formidable");
const port = 3000;

app.use(formidableMiddleware());

const myCities = [
  {
    id: 1,
    cityName: "Valencia",
    country: "Spain",
    latitude: 39.46,
    longitude: -0.37,
    weather: 28.5,
  },
  {
    id: 2,
    cityName: "Paris",
    country: "France",
    latitude: 48.85,
    longitude: 2.27,
    weather: 24.5,
  },
  {
    id: 3,
    cityName: "Estambul",
    country: "Turkey",
    latitude: 41.04,
    longitude: 28.99,
    weather: 34.5,
  },
  {
    id: 4,
    cityName: "Tokyo",
    country: "Japan",
    latitude: 35.5,
    longitude: 138.64,
    weather: 29.5,
  },
];

const myLogger = (req, res, next) => {
  const visitTime = new Date();
  console.log(`visited ${req.url} at ${visitTime.toLocaleString()}`);
  next();
};
app.use(myLogger);

const minObject = (cityObject) => {
  return {
    cityId: cityObject.id,
    cityName: cityObject.cityName,
    weather: cityObject.weather,
    latitude: cityObject.latitude,
  };
};

app.get("/", (req, res) => {
  res.send(myCities);
});

app.get("/city/:cityName", (req, res) => {
  const name = req.params.cityName;
  res.send(searchByName(myCities, name));
});

app.get("/citycrud/:id", (req, res) => {
  const id = req.params.id;
  res.send(searchById(myCities, id));
});

app.get("/city/search/:text", (req, res) => {
  const searchTerm = req.params.text;
  let result = [];
  if (searchTerm != undefined) {
    result = searchByText(myCities, searchTerm);
  }
  res.send(result);
});

app.get("/city", (req, res) => {
  const name = req.query.name;
  const lat = req.query.lat;
  const lon = req.query.lon;
  let result = [];

  if (name != undefined) {
    result = searchByName(myCities, name);
  } else if (lat != undefined) {
    result = searchByCoords(myCities, lat);
  } else {
    null;
  }

  res.send(result);
});

let searchByName = (myCities, name) => {
  let result = myCities.filter(
    (cities) => cities.cityName.toLowerCase() == name.toLowerCase()
  );
  return result.map(minObject);
};

let searchById = (myCities, id) => {
  let result = myCities.filter((city) => city.id == id);
  return result.map(minObject);
};

let searchByCoords = (myCities, lat) => {
  let result = myCities.filter((cities) => cities.latitude == lat);
  return result.map(minObject);
};

let searchByText = (myCities, searchTerm) => {
  let result = myCities.filter((cities) =>
    cities.cityName.toLowerCase().includes(searchTerm)
  );
  return result.map(minObject);
};

app.post("/citycrud", function (req, res) {
  console.log(req.fields);
  res.send("Got a POST request");
});

const searchForPut = (myCities, id) => {
  console.log();
  return myCities.findIndex((city) => city.id == id);
};

app.put("/citycrud/:id", function (req, res) {
  const id = req.params.id;
  const updatedCity = req.fields;
  let cityWithIdIndex = searchForPut(myCities, parseInt(id));

  console.log(cityWithIdIndex);
  if (cityWithIdIndex !== -1) {
    myCities[cityWithIdIndex] = updatedCity;
  }
  console.log(req.fields);
  res.send(updatedCity);
});

app.delete("/citycrud/:id", function (req, res) {
  const id = req.params.id;
  let deletedData = myCities.splice(searchForPut(myCities, id), 1);
  console.log(deletedData);
  let newArray = myCities.slice(deletedData);
  res.send(newArray);
});

app.listen(port, () =>
  console.log(`Exampl listening at http://localhost:${port}`)
);
