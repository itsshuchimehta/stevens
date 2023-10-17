const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/protected", (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
    });
  } else {
    next();
  }
});

const LoggerDetails = function (request, response, next) {
  console.log(
    `[${new Date().toUTCString()}]: ${request.method} ${request.originalUrl} ${
      LogInStatus(request) ? "(Authenticated User)" : "(Non-Authenticated User)"
    }`
  );
  next();
};
app.use(LoggerDetails);

const LogInStatus = function (request) {
  return !!request.session.user;
};

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
