const users = require("./users");
const api = require("./api");
const admin = require("./admin");
const blogs = require("./blogs");
const products = require("./products");
const cart = require("./cart");
const subscriptions = require("./subscriptions");
const path = require("path");

const constructorMethod = (app) => {
  app.use("/", users);
  app.use("/api", api);
  app.use("/admin", admin);
  app.use("/blogs", blogs);
  app.use("/products", products);
  app.use("/cart", cart);
  app.use("/subscriptions", subscriptions);

  app.use("*", (req, res) => {
    res.redirect("/404");
  });
};

module.exports = constructorMethod;
