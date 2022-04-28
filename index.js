"use strict";
const express = require("express");
const app = express();
const port = 3000;
const recipeData = require("./");

app.get("/", homeHandler);
app.get("/favorite", handleFirstRout);
app.get("/recipes", recipesHandler);

function handleFirstRout(req, res) {
  res.send("Welcome to Favorite Page");
}

function homeHandler(req, res) {
  res.send("Hello World");
}

function receipesHandler(req, res) {
  let result = [];
  recipeData.data.forEach((element) => {
    let newRecipe = new Recipe(
      element.title,
      element.poster_path,
      element.overview
    );
    result.push(newRecipe);
  });
  console.log(result);
  res.json(result);
}

function Recipe(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
