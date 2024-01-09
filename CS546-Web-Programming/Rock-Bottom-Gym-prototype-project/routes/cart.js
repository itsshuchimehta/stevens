const express = require("express");
const { url } = require("inspector");
const router = express.Router();
const path = require("path");
const xss = require("xss");
const data = require("../data");
const helper = require("../helpers");
const blog_category = data.blogs;
const users = data.users;
const order = data.order;

router
  .route("/")
  .get(async (req, res) => {
    if (req.session.userdata) {
      try {
        const Result = await order.getCartItems(req.session.userdata.user_id);
        res.status(200).render("cart", {
          title: "Cart",
          user_header: true,
          user_footer: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
          profileimage: req.session.other.profileimage,
          cartdata: Result,
        });
      } catch (e) {
        if (e.message === "Cart is Empty") {
          res.status(e.code).render("EmptyCart", {
            hasErrors: true,
            error: e.message,
            title: "Error",
            user_header: true,
            user_footer: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
          });
        } else {
          res.status(e.code).render("Error", {
            hasErrors: true,
            error: e.message,
            title: "Error",
            user_header: true,
            user_footer: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
          });
        }
        return;
      }
    } else {
      res.redirect("/login");
    }
    return;
  })
  .put(async (req, res) => {
    if (req.session.userdata) {
      try {
        const data = {};
        data.cart_id = xss(req.body.cart_id);
        const UpdateCart = await order.RemoveFromCartByProductid(data.cart_id);
        if (UpdateCart) {
          return res.status(200).json({ url: "/cart" });
        }
      } catch (e) {
        if (e.code === 400) {
          res.status(e.code).render("EmptyCart", {
            hasErrors: true,
            error: e.message,
            title: "Error",
            user_header: true,
            user_footer: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
          });
        } else {
          res.status(e.code).render("Error", {
            hasErrors: true,
            error: e.message,
            title: "Error",
            user_header: true,
            user_footer: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
          });
        }
      }
    } else {
      res.redirect("/404");
    }
    return;
  });
router.route("/AddTocart").post(async (req, res) => {
  if (req.session.userdata) {
    const data = {};
    data.product_id = xss(req.body.HiddenProduct);
    if (req.body.size) {
      data.size = xss(req.body.size);
    } else {
      data.size = "";
    }
    data.qty = xss(req.body.quantity);
    try {
      const Result = await order.AddToCart(
        req.session.userdata.user_id,
        data.product_id,
        data.size,
        data.qty
      );
      if (Result.cartstatus === true) {
        res.redirect("/cart");
      } else {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: e.message,
          title: "Error",
          user_header: true,
          user_footer: true,
          UserFullname: req.session.other.UserFullname,
          loggedIn: true,
        });
        return;
      }
    } catch (e) {
      res.status(e.code).render("Error", {
        hasErrors: true,
        error: e.message,
        title: "Error",
        user_header: true,
        user_footer: true,
        UserFullname: req.session.other.UserFullname,
        loggedIn: true,
      });
      return;
    }
  } else {
    res.redirect("/login");
  }
  return;
});

router.route("/PlaceOrder").post(async (req, res) => {
  if (req.session.userdata) {
    try {
      const Result = await order.PlaceOrder(req.session.userdata.user_id);
      if (Result.orderstatus === true) {
        res.status(200).render("OrderSuccess", {
          title: "Order Success",
          user_header: true,
          user_footer: true,
          loggedIn: true,
          UserFullname: req.session.other.UserFullname,
        });
        return;
      } else {
        res.status(e.code).render("Error", {
          hasErrors: true,
          error: e.message,
          title: "Error",
          user_header: true,
          user_footer: true,
          UserFullname: req.session.other.UserFullname,
          loggedIn: true,
        });
        return;
      }
    } catch (e) {
      res.status(e.code).render("Error", {
        hasErrors: true,
        error: e.message,
        title: "Error",
        user_header: true,
        user_footer: true,
        UserFullname: req.session.other.UserFullname,
        loggedIn: true,
      });

      return;
    }
  } else {
    res.redirect("/login");
  }
  return;
});

module.exports = router;
