const express = require("express");
const router = express.Router();
const data = require("../data");
const peopleData = data.people;
const path = require("path");

router.route("/").get(async (req, res) => {
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route("/searchpeople").post(async (req, res) => {
  let blogPostData = req.body;
  let errors = [];
  try {
    if (!blogPostData.name) {
      throw "Error 400 : Please provid name for search !";
    }
    if (typeof blogPostData.name !== "string") {
      throw "Error 400 : Please provid String value for search";
    }
    if (blogPostData.name.replace(/\s+/g, "").length === 0) {
      throw "Error 400 : Please provid valid value for search, Empty Spaces can not considered as valid input !";
    }

    if (Number.isInteger(Number(blogPostData.name.trim())) === true) {
      throw "Error 400 : Please provid Alphabetical values for search";
    }
  } catch (e) {
    res.status(400).render("error", {
      errors: [e],
      hasErrors: true,
      title: "Error",
    });
    return;
  }

  try {
    const peopleList = await peopleData.searchPeopleByName(blogPostData.name);
    if (peopleList.length > 0) {
      res.status(200).render("peopleFound", {
        peopleResult: peopleList,
        searchedName: blogPostData.name,
        title: "People Found",
      });
    } else {
      res.status(404).render("personNotFound", {
        searchPersonName: blogPostData.name,
        title: "Person Not Found",
      });
    }
  } catch (e) {
    res.status(500).render("error", {
      errors: [e],
      hasErrors: true,
      title: "Error",
    });
  }
});

router.route("/persondetails/:id").get(async (req, res) => {
  let errors = [];

  if (!req.params.id) {
    errors.push("Error 400 : Please provid id for search !");
  }
  if (req.params.id === undefined) {
    errors.push("Error 400 : Please provid id for search !");
  }
  id = req.params.id.trim();
  if (id.length === 0)
    errors.push("Error 400 : id cannot be an empty string or just spaces");
  id = Number(req.params.id);
  if (Number.isInteger(id) == false || id < 0)
    errors.push("Error 400 : Please provide valid URL Parameter");

  if (errors.length > 0) {
    res.status(400).render("error", {
      errors: errors,
      hasErrors: true,
      title: "Error",
    });
    return;
  }
  try {
    const peopleList = await peopleData.searchPeopleByID(req.params.id);

    if (Object.keys(peopleList).length > 0) {
      res.status(200).render("personFoundByID", {
        peopleResult: peopleList,
        id: req.params.id,
        title: "Person Found",
      });
    } else {
      res.status(404).render("personNotFound", {
        searchPersonName: `with parameter ${req.params.id}`,
        title: "Person Not Found",
      });
    }
  } catch (e) {
    res.status(500).render("error", {
      errors: [e],
      hasErrors: true,
      title: "Error",
    });
  }
});
module.exports = router;
