const pokemonRoutes = require("./pokemon");

const constructorMethod = (app) => {
  app.use("/", pokemonRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
