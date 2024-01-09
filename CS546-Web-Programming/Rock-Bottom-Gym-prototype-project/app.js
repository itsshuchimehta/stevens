//Here is where you'll set up your server as shown in lecture code
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const session = require("express-session");
const public = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", public);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

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

// app.use("/logout", async (req, res, next) => {
//   if (req.method == "GET") {
//     req.method = "POST";
//   }
//   next();
// });


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
