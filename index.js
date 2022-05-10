"use strict";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const apikey = process.env.apikey;
app.use(cors());
const PORT = 3000;
const recipeData = require("./Movies_Data/data.json");
const res = require("express/lib/response");

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

function handelCollection(req ,res) {
  axios
    .get(`https://api.themoviedb.org/3/collection/97460?api_key=${apikey}`)
    .then((collection) => {
      return res.status(200).json(collection.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function Recipe(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function errorHandler(req, res) {
  res.status(404).send("This Rout Is Not Exist");
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
