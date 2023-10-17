//here is where you'll set up your server as shown in lecture code.
const express = require("express");
const app = express();
const configRoutes = require("./routes");

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
