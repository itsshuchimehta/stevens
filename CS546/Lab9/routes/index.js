const sortArrayRoutes = require("./sortArray");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", sortArrayRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
