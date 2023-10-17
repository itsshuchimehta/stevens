const peopleRoutes = require("./people");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", peopleRoutes);

  app.use("*", (req, res) => {
    let errors = [];
    errors.push("Error 404 : No Page Found!");
    res.status(404).render("error", {
      errors: errors,
      hasErrors: true,
      title: "Error",
    });
  });
};

module.exports = constructorMethod;
