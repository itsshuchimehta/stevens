const express = require("express");
const router = express.Router();
const path = require("path");
const xss = require("xss");
const data = require("../data");
const helper = require("../helpers");
const blog = data.blogs;
const users = data.users;
const order = data.order;
const subscriptions = data.subscriptions;
const product = data.products;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.status(200).json({ error: "Website is working" });
});

router
  .route("/product")
  .get(async (req, res) => {})
  .post(async (req, res) => {
    //code here for GET
  });

router
  .route("/AddBlog")
  .get(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        try {
          const Result = await blog.getAllBlogCategories();
          //code here for GET
          res.status(200).render("admin/AddBlog", {
            title: "Add Blog",
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
    } else {
      res.redirect("/404");
    }
    return;
  })
  .post(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        const BlogPostData = {};
        BlogPostData.blog_name = xss(req.body.blogname);
        BlogPostData.blog_category_id = xss(req.body.blogcategory);
        BlogPostData.description = xss(req.body.blogdesc);
        let Result = await blog.getAllBlogCategories();
        try {
          BlogPostData.blog_name = helper.checkBlogName(BlogPostData.blog_name);
          BlogPostData.blog_category_id = helper.checkObjectId(
            BlogPostData.blog_category_id
          );
          BlogPostData.description = helper.checkBlogDescription(
            BlogPostData.description
          );
        } catch (e) {
          res.status(e.code).render("admin/AddBlog", {
            error: e.message,
            hasErrors: true,
            title: "Add Blog",
            dashHeader: true,
            dashfooter: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
            profileimage: req.session.other.profileimage,
            formdata: Result,
            adminUsergroup: req.session.userdata.isadmin,
          });
          return;
        }
        try {
          BlogPostData.user_id = req.session.userdata.user_id;
          const { user_id, blog_name, blog_category_id, description } =
            BlogPostData;

          const Blog = await blog.createBlog(
            user_id,
            blog_name,
            blog_category_id,
            description
          );

          if (Blog) {
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
            res.status(400).render("admin/AddBlog", {
              hasErrors: true,
              error: e.message,
              title: "Add Blog",
              dashHeader: true,
              dashfooter: true,
              loggedIn: true,
              formdata: Result,
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
      } else {
        res.redirect("/404");
      }
    } else {
      res.redirect("/404");
    }
  });

router
  .route("/AddSubscription")
  .get(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        try {
          const Result = await subscriptions.getAllSubscriptionPlans();
          //code here for GET
          res.status(200).render("admin/AddSubscription", {
            title: "Add Subscription Plan",
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
    } else {
      res.redirect("/404");
    }
    return;
  })
  .post(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        const PostData = {};
        PostData.name = xss(req.body.name);
        PostData.description = xss(req.body.description);
        PostData.membership_amount = xss(req.body.price);
        PostData.duration = xss(req.body.duration);

        try {
          PostData.name = helper.checkSubscriptionName(PostData.name);
          PostData.description = helper.checkSubscriptionDescription(
            PostData.description
          );
          PostData.membership_amount = helper.checkSubscriptionAmount(
            PostData.membership_amount
          );
          PostData.duration = helper.checkSubscriptionDuration(
            PostData.duration
          );
        } catch (e) {
          res.status(e.code).render("admin/AddSubscription", {
            error: e.message,
            hasErrors: true,
            title: "Add Subscription",
            dashHeader: true,
            dashfooter: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
            profileimage: req.session.other.profileimage,
            adminUsergroup: req.session.userdata.isadmin,
          });
          return;
        }
        try {
          const { name, description, membership_amount, duration } = PostData;

          const InsertPlan = subscriptions.createNewSubscriptionPlan(
            name,
            description,
            membership_amount,
            duration
          );

          if (InsertPlan) {
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
            res.status(400).render("admin/AddSubscription", {
              hasErrors: true,
              error: e.message,
              title: "Add Subscription",
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
      } else {
        res.redirect("/404");
      }
    } else {
      res.redirect("/404");
    }
  });

router
  .route("/AddProduct")
  .get(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        try {
          // const Result = await product.getAllProducts();
          //code here for GET
          res.status(200).render("admin/AddProduct", {
            title: "Add New Product",
            dashHeader: true,
            dashfooter: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
            profileimage: req.session.other.profileimage,
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
    } else {
      res.redirect("/404");
    }
    return;
  })
  .post(async (req, res) => {
    if (req.session.userdata) {
      if (req.session.userdata.isadmin == true) {
        const PostData = {};
        PostData.name = xss(req.body.name);
        PostData.description = xss(req.body.description);
        PostData.price = xss(req.body.price);
        PostData.category = xss(req.body.category);
        PostData.size = xss(req.body.size);
        PostData.color = xss(req.body.color);
        try {
          PostData.name = helper.checkProductName(PostData.name);
          PostData.description = helper.checkProductDescription(
            PostData.description
          );
          PostData.price = helper.checkProductPrice(PostData.price);
          PostData.category = helper.checkProductCategory(PostData.category);
          // console.log(__dirname);
          if (req.files) {
            let { image } = req.files;

            image.name = Date.now() + image.name;

            if (!image) throw { code: 400, message: "Please upload the image" };

            image.mv(__dirname + "/../public/images/product/" + image.name);

            if (image.name != "") {
              PostData.product_img = image.name;
            }
          }
        } catch (e) {
          res.status(e.code).render("admin/AddProduct", {
            error: e.message,
            hasErrors: true,
            title: "Add Product",
            dashHeader: true,
            dashfooter: true,
            loggedIn: true,
            UserFullname: req.session.other.UserFullname,
            profileimage: req.session.other.profileimage,
            adminUsergroup: req.session.userdata.isadmin,
          });
          return;
        }
        try {
          const {
            name,
            description,
            price,
            category,
            size,
            product_img,
            color,
          } = PostData;

          const InsertProduct = await product.createProduct(
            name,
            description,
            price,
            category,
            size,
            product_img,
            color
          );

          if (InsertProduct) {
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
            res.status(400).render("admin/AddProduct", {
              hasErrors: true,
              error: e.message,
              title: "Add Product",
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
      } else {
        res.redirect("/404");
      }
    } else {
      res.redirect("/404");
    }
  });

module.exports = router;
