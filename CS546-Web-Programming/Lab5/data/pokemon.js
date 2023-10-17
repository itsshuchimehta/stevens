const axios = require("axios");

const pokemon = async () => {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon");
  return data;
};

const pokemonById = async (id) => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return data;
};

module.exports = { pokemon, pokemonById };
