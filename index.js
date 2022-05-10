"use strict";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const pg = require("pg");
require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const apikey = process.env.apikey;
app.use(cors());
const PORT = 3000;
const recipeData = require("./Movies_Data/data.json");
const res = require("express/lib/response");
const req = require("express/lib/request");

const client = new pg.Client(process.env.postgressurl);

function Recipe(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

let results = [];
function Movie(id, original_title, release_date, poster_path, overview) {
  this.id = id;
  this.original_title = original_title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
  results.push(this);
}

app.get("/", homeHandler);
app.get("/favorite", handleFirstRout);
app.get("/trending", handelTrending);
app.get("/search", handelSearch);
app.get("/collection", handelCollection);
app.post("/addmovie", handleAddtion);
app.get("/getmovies", handelGetMovies);
app.get("/*", errorHandler);

function homeHandler(req, res) {
  console.log(recipeData);
  let newRecipe = new Recipe(
    recipeData.title,
    recipeData.poster_path,
    recipeData.overview
  );
  res.json(newRecipe);
  res.send("data is recived");
}

function handleFirstRout(req, res) {
  res.send("Welcome to Favorite Page");
}

function handelTrending(req, res) {
  axios
    .get(`https://api.themoviedb.org/3/trending/all/day?api_key=${apikey}`)
    .then((movies) => {
      movies.data.results.forEach((element) => {
        console.log(element);
        new Movie(
          element.id,
          element.original_title,
          element.release_date,
          element.poster_path,
          element.overview
        );
      });
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handelSearch(req, res) {
  const { keyword } = req.query;
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${keyword}`
    )
    .then((movies) => {
      return res.status(200).json(movies.data.results);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handelCollection(req, res) {
  axios
    .get(`https://api.themoviedb.org/3/collection/97460?api_key=${apikey}`)
    .then((collection) => {
      return res.status(200).json(collection.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleAddtion(req, res) {
  console.log(req.body);
  const { original_title, release_date, poster_path, overview } = req.body;
  let sql =
    "INSERT INTO movie(original_title,release_date,poster_path,overview ) VALUES($1, $2, $3, $4) RETURNING *;";
  let values = [original_title, release_date, poster_path, overview];
  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handelGetMovies(req, res) {
  let sql = "SELECT * from movie";
  client
    .query(sql)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

function errorHandler(req, res) {
  res.status(404).send("This Rout Is Not Exist");
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
});
