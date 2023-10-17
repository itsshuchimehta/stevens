const express = require("express");
const router = express.Router();
const path = require("path");

router.route("/").get(async (req, res) => {
  res.sendFile(path.resolve("static/homepage.html"));
});
module.exports = router;
