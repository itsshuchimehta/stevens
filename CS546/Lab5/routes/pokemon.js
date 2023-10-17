const express = require("express");
const data = require("../data");
const pokemonData = data.pokemon;
const axios = require("axios");
const validation = require("../helpers");
const router = express.Router();

router
  .route("/pokemon")
  //Request Method
  .get(async (req, res) => {
    try {
      const pokemonList = await pokemonData.pokemon();
      res.json(pokemonList);
    } catch (e) {
      res.status(500).send(e);
    }
  });

router
  .route("/pokemon/:id")
  //Request Method
  .get(async (req, res) => {
    try {
      validation.checkId(req.params.id);

      try {
        req.params.id = req.params.id.trim();
        const pokemon = await pokemonData.pokemonById(req.params.id);
        res.json(pokemon);
      } catch (error) {
        res.status(404).json({ error: "Pokémon Not Found!" });
      }
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

module.exports = router;
