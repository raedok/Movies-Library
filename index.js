"use strict";
const express = require("express");
const cors = require("cors")
const app = express();
app.use(cors());
const PORT = 3000;
const recipeData = require("./Movies_Data/data.json");

app.get("/", homeHandler);
app.get("/favorite", handleFirstRout);
app.get("/*", errorHandler);

function handleFirstRout(req, res) {
  res.send("Welcome to Favorite Page");
}


function homeHandler(req, res) {
  console.log(recipeData)
  let newRecipe = new Recipe(
    recipeData.title,
    recipeData.poster_path,
    recipeData.overview
  )
  res.json(newRecipe);
  res.send("data is recived");
}

function Recipe(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function errorHandler(req,res) {
res.status(404).send("This Rout Is Not Exist");
}



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
