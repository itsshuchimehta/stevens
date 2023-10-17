const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const userData = data.users;
const validation = require("../helpers");

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/protected");
  }
  res.status(200).render("userLogin", {
    title: "User Login",
  });
});

router
  .route("/register")
  .get(async (req, res) => {
    res.status(200).render("userRegister", {
      title: "User Register",
    });
  })
  .post(async (req, res) => {
    const userPostData = req.body;

    try {
      if (!userPostData.usernameInput || !userPostData.passwordInput)
        throw "Username and Password Must be supplied";
      validation.CheckUsername(userPostData.usernameInput);
      validation.CheckPassword(userPostData.passwordInput);
    } catch (e) {
      res.status(400).render("userRegister", {
        error: e,
        hasErrors: true,
        title: "User Register",
      });
      return;
    }

    try {
      userPostData.username = userPostData.usernameInput.trim();
      userPostData.password = userPostData.passwordInput.trim();
      const { username, password } = userPostData;

      const ResultStatus = await userData.createUser(username, password);
      if (ResultStatus.insertedUser === true) {
        res.redirect("/");
      }
    } catch (e) {
      if (e == "Username Already Exist! try other Username") {
        res.status(400).render("userRegister", {
          error: e,
          hasErrors: true,
          title: "User Register",
        });
      } else {
        e = "Internal Server Error";
        res.status(500).json({ error: e });
      }
      return;
    }
  });

router.route("/login").post(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/protected");
  }

  const userPostData = req.body;

  try {
    if (!userPostData.usernameInput || !userPostData.passwordInput)
      throw "Username and Password Must be supplied";
    validation.CheckUsername(userPostData.usernameInput);
    validation.CheckPassword(userPostData.passwordInput);
  } catch (e) {
    res.status(400).render("userLogin", {
      error: e,
      hasErrors: true,
      title: "User Login",
    });
    return;
  }

  try {
    userPostData.username = userPostData.usernameInput.trim();
    userPostData.password = userPostData.passwordInput.trim();
    const { username, password } = userPostData;

    const ResultStatus = await userData.checkUser(username, password);
    if (ResultStatus.authenticatedUser === true) {
      req.session.user = userPostData.usernameInput;
      res.redirect("/protected");
    }
  } catch (e) {
    if (e == "No User found!" || e == "Wrong Password! Try Again!") {
      res.status(404).render("userLogin", {
        error: e,
        hasErrors: true,
        title: "User Login",
      });
    } else {
      res.status(500).json({ error: e });
    }
    return;
  }
});

router.route("/protected").get(async (req, res) => {
  res.status(200).render("private", {
    title: "Welcome",
    user: req.session.user,
    time: new Date().toUTCString(),
  });
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.status(200).render("logout", {
    title: "Logged out",
  });
});
module.exports = router;
