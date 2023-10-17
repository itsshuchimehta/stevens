const routesAPIRoutes = require("./routesAPI");

const constructorMethod = (app) => {
  app.use("/", routesAPIRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
