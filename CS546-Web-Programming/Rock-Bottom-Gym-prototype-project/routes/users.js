const express = require("express");
const router = express.Router();
const path = require("path");
const xss = require("xss");
const data = require("../data");
const helper = require("../helpers");
const blog_category = data.blogs;
const users = data.users;
const order = data.order;

router.route("/").get(async (req, res) => {
  if (req.session.userdata) {
    res.status(200).render("index", {
      title: "Welcome",
      user_header: true,
      user_footer: true,
      UserFullname: req.session.other.UserFullname,
      profileimage: req.session.other.profileimage,
      loggedIn: true,
      adminUsergroup: req.session.userdata.isadmin,
    });
    return;
  }

  try {
    res.status(200).render("index", {
      title: "Welcome",
      user_header: true,
      user_footer: true,
      NotloggedIn: true,
    });
    return;
  } catch (e) {
    res.status(e.code).json(e.message);
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.userdata) {
      return res.redirect("/dashboard");
    }
    //code here for GET
    res.status(200).render("login", {
      title: "Login",
      user_header: true,
      user_footer: true,
      NotloggedIn: true,
    });
    return;
  })
  .post(async (req, res) => {
    if (req.session.userdata) {
      return res.redirect("/dashboard");
    }
    const userPostData = {};
    userPostData.email = xss(req.body.email);
    userPostData.password = xss(req.body.password);
    try {
      if (!userPostData.email || !userPostData.password)
        throw { code: 400, message: "Email and Password Must be supplied" };

      helper.checkEmail(userPostData.email);
      helper.checkPassword(userPostData.password);
    } catch (e) {
      res.status(e.code).render("login", {
        error: e.message,
        hasErrors: true,
        title: "Login",
        user_header: true,
        user_footer: true,
        NotloggedIn: true,
      });
      return;
    }

    try {
      userPostData.email = userPostData.email.trim();
      const { email, password } = userPostData;

      const ResultStatus = await users.checkUser(email, password);
      if (ResultStatus.authenticatedUser === true) {
        req.session.userdata = {
          email: userPostData.email,
          user_id: ResultStatus.user_id,
          group_id: ResultStatus.groupid,
          isadmin: ResultStatus.role,
        };

        const Result = await users.getUserById(req.session.userdata.user_id);
        req.session.other = {
          UserFullname: Result.firstname + " " + Result.lastname,
          profileimage:
            Result.profile_image != "" ? Result.profile_image : "blank.webp",
        };

        res.redirect("/dashboard");
      }
    } catch (e) {
      if (e.message == "No User found!" || e == "Wrong Password! Try Again!") {
        res.status(e.code).render("login", {
          error: e.message,
          hasErrors: true,
          title: "Login",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
        return;
      } else {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: "Internal Server Error",
          title: "Error",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      }
      return;
    }
  });

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.userdata) {
      return res.redirect("/dashboard");
    }
    //code here for GET
    res.status(200).render("register", {
      title: "Register",
      user_header: true,
      user_footer: true,
      NotloggedIn: true,
    });
    return;
  })
  .post(async (req, res) => {
    if (req.session.userdata) {
      return res.redirect("/dashboard");
    }
    const group_id = await users.getUserGroupByName("user");

    const userPostData = {};
    userPostData.firstname = xss(req.body.firstname);
    userPostData.lastname = xss(req.body.lastname);
    userPostData.address = xss(req.body.address);
    userPostData.email = xss(req.body.email);
    userPostData.gender = xss(req.body.gender);
    userPostData.dob = xss(req.body.dob);
    userPostData.zipcode = xss(req.body.zipcode);
    userPostData.cell = xss(req.body.cell);
    userPostData.password = xss(req.body.password);

    try {
      userPostData.firstname = helper.checkFirstName(userPostData.firstname);
      userPostData.lastname = helper.checkLastName(userPostData.lastname);
      userPostData.gender = helper.checkGender(userPostData.gender);
      userPostData.dob = helper.checkDob(userPostData.dob);
      userPostData.address = helper.checkAddress(userPostData.address);
      userPostData.zipcode = helper.checkZipCode(userPostData.zipcode);
      userPostData.cell = helper.checkNumber(userPostData.cell);
      userPostData.email = helper.checkEmail(userPostData.email);
      userPostData.password = helper.checkPassword(userPostData.password);
    } catch (e) {
      res.status(400).render("register", {
        AlreadyExist: false,
        BadInput: true,
        error: e.message,
        title: "Register",
        user_header: true,
        user_footer: true,
        NotloggedIn: true,
      });
      return;
    }

    try {
      const {
        firstname,
        lastname,
        gender,
        dob,
        address,
        zipcode,
        cell,
        email,
        password,
      } = userPostData;

      const ResultStatus = await users.createUser(
        firstname,
        lastname,
        gender,
        dob,
        address,
        zipcode,
        cell,
        email,
        password,
        group_id._id
      );

      if (ResultStatus.insertedUser === true) {
        res.status(200).render("userRegisterSuccess", {
          hasErrors: false,
          title: "User Registered Successfully",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
        return;
      }
    } catch (e) {
      if (e.message == "Username Already Exist!") {
        res.status(e.code).render("register", {
          AlreadyExist: true,
          title: "Register",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      } else if (e.code === 500) {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: "Internal Server Error",
          title: "Error",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      } else {
        res.status(e.code).render("register", {
          AlreadyExist: false,
          BadInput: true,
          error: e.message,
          title: "Register",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      }
      return;
    }
  });

router
  .route("/forgotPassword")
  .get(async (req, res) => {
    res.status(200).render("forgotPassword", {
      title: "Forgot Password",
      user_header: true,
      user_footer: true,
      NotloggedIn: true,
    });
    return;
  })
  .post(async (req, res) => {
    const data = {};
    data.email = xss(req.body.email);
    try {
      if (!data.email) {
        throw { code: 400, message: "No email id Provided" };
      }
      let UserData = await users.getUserByEmail(data.email);
      if (UserData !== null) {
        //code here for GET
        res.status(200).render("verificationSuccess", {
          title: "Verification Success",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      } else {
        res.status(404).render("UserNotFound", {
          title: "User Not Found",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
        });
      }
      return;
    } catch (e) {
      res.status(e.code).render("forgotPassword", {
        title: "Forgot Password",
        user_header: true,
        user_footer: true,
        NotloggedIn: true,
      });
      return;
    }
  });

router.route("/dashboard").get(async (req, res) => {
  if (req.session.userdata) {
    res.status(200).render("dashboard", {
      title: "Dashboard",
      dashHeader: true,
      dashfooter: true,
      loggedIn: true,
      UserFullname: req.session.other.UserFullname,
      profileimage: req.session.other.profileimage,
      adminUsergroup: req.session.userdata.isadmin,
    });
  } else {
    res.redirect("/login");
  }
  return;
});
router
  .route("/UserProfile")
  .get(async (req, res) => {
    if (req.session.userdata) {
      try {
        const Result = await users.getUserById(req.session.userdata.user_id);
        //code here for GET
        res.status(200).render("UserProfile", {
          title: "My Profile",
          dashHeader: true,
          dashfooter: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
          profileimage: req.session.other.profileimage,
          formdata: Result,
          adminUsergroup: req.session.userdata.isadmin,
        });
      } catch (e) {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: e.message,
          title: "Error",
          user_header: true,
          user_footer: true,
          loggedIn: true,
          adminUsergroup: req.session.userdata.isadmin,
        });
      }
    } else {
      res.redirect("/404");
    }
    return;
  })
  .post(async (req, res) => {
    if (!req.session.userdata) {
      res.redirect("/404");
    }

    const userPostData = {};
    userPostData.firstname = xss(req.body.firstname);
    userPostData.lastname = xss(req.body.lastname);
    userPostData.gender = xss(req.body.gender);
    userPostData.dob = xss(req.body.dob);
    userPostData.address = xss(req.body.address);
    userPostData.zipcode = xss(req.body.zipcode);
    userPostData.cell = xss(req.body.cell);
    userPostData.CurrImg = xss(req.body.CurrImg);
    userPostData.new_password = xss(req.body.new_password);

    let changeinImage = false;
    let changeinPassword = false;

    try {
      const Result = await users.getUserById(req.session.userdata.user_id);
    } catch (e) {
      res.status(e.code).render("Error", {
        hasErrors: true,
        error: e.message,
        title: "Error",
        user_header: true,
        user_footer: true,
        loggedIn: true,
        adminUsergroup: req.session.userdata.isadmin,
      });
    }

    try {
      userPostData.firstname = helper.checkFirstName(userPostData.firstname);
      userPostData.lastname = helper.checkLastName(userPostData.lastname);
      userPostData.gender = helper.checkGender(userPostData.gender);
      userPostData.dob = helper.checkDob(userPostData.dob);
      userPostData.address = helper.checkAddress(userPostData.address);
      userPostData.zipcode = helper.checkZipCode(userPostData.zipcode);
      userPostData.cell = helper.checkNumber(userPostData.cell);

      if (userPostData.CurrImg === "") {
        userPostData.profile_image = "";
        changeinImage = true;
      }

      if (req.files) {
        let { image } = req.files;

        image.name = Date.now() + image.name;

        if (!image) throw { code: 400, message: "Please upload the image" };

        image.mv(__dirname + "/../public/images/UserProfile/" + image.name);

        if (image.name != "") {
          userPostData.profile_image = image.name;
          changeinImage = true;
        }
      }

      if (userPostData.new_password) {
        userPostData.password = helper.checkPassword(userPostData.new_password);
        changeinPassword = true;
      }

      if (changeinPassword === false) {
        userPostData.password = "NoChange";
      }
      if (changeinImage === false) {
        userPostData.profile_image = "NoChange";
      }
    } catch (e) {
      if (req.session.userdata) {
        res.status(e.code).render("UserProfile", {
          error: e.message,
          hasErrors: true,
          title: "My Profile",
          dashHeader: true,
          dashfooter: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
          profileimage: req.session.other.profileimage,
          formdata: Result,
          adminUsergroup: req.session.userdata.isadmin,
        });
        return;
      } else {
        res.redirect("/404");
      }
    }

    try {
      const {
        firstname,
        lastname,
        gender,
        dob,
        address,
        zipcode,
        cell,
        password,
        profile_image,
      } = userPostData;

      let id = req.session.userdata.user_id;
      const ResultStatus = await users.UpdateProfile(
        id,
        firstname,
        lastname,
        gender,
        dob,
        address,
        zipcode,
        cell,
        password,
        profile_image,
        changeinImage,
        changeinPassword
      );

      if (ResultStatus.UpdateData === true) {
        req.session.other.UserFullname =
          ResultStatus.firstname + " " + ResultStatus.lastname;

        req.session.other.profileimage =
          ResultStatus.profile_image != ""
            ? ResultStatus.profile_image
            : "blank.webp";

        res.status(200).render("dashboard", {
          title: "Dashboard",
          dashHeader: true,
          dashfooter: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
          profileimage: req.session.other.profileimage,
          adminUsergroup: req.session.userdata.isadmin,
        });
        return;
      }
    } catch (e) {
      if (e.code === 400) {
        res.status(400).render("UserProfile", {
          hasErrors: true,
          error: e.message,
          title: "My Profile",
          dashHeader: true,
          dashfooter: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
          profileimage: req.session.other.profileimage,
          adminUsergroup: req.session.userdata.isadmin,
        });
      } else if (e.code === 500) {
        res.status(500).render("Error", {
          hasErrors: true,
          error: "Internal Server Error",
          title: "Error",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
          adminUsergroup: req.session.userdata.isadmin,
        });
      } else {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: e.message,
          title: "Error",
          user_header: true,
          user_footer: true,
          NotloggedIn: true,
          adminUsergroup: req.session.userdata.isadmin,
        });
      }
      return;
    }
  });

router.route("/Orderdetails").get(async (req, res) => {
  if (req.session.userdata) {
    res.status(200).render("OrderDetails", {
      title: "Orders",
      dashHeader: true,
      dashfooter: true,
      loggedIn: true,
      UserFullname: req.session.other.UserFullname,
      profileimage: req.session.other.profileimage,
    });
  } else {
    res.redirect("/404");
  }
  return;
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.route("/404").get(async (req, res) => {
  if (req.session.userdata) {
    res.status(404).render("404", {
      title: "Page Not Found",
      Err404: true,
      user_header: true,
      user_footer: true,
      loggedIn: true,
      UserFullname: req.session.other.UserFullname,
      profileimage: req.session.other.profileimage,
    });
    return;
  } else {
    res.status(404).render("404", {
      title: "Page Not Found",
      Err404: true,
      user_header: true,
      user_footer: true,
      NotloggedIn: true,
    });
    return;
  }
});

router.route("/isLoggedIn").get(async (req, res) => {
  if (req.session.userdata) {
    return res.status(200).json({
      status: true,
    });
  }
  return res.status(200).json({
    status: false,
  });
});

module.exports = router;
