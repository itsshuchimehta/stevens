const e = require("express");
const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");
const blogs = data.blogs;

//Get the Blogs category 
router.route("/").get(async (req, res) => {
    try {

        let blogs_category = await blogs.getAllBlogCategories();

        if (req.session.userdata) {

            return res.status(200).render("blogs/blogsCategory", {
                title: "Blog Category",
                blogs_category: blogs_category,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,

            });
        }

        else {

            return res.status(200).render("blogs/blogsCategory", {
                title: "Blog Category",
                blogs_category: blogs_category,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
    catch (e) {

        if (req.session.userdata) {
            return res.status(e.code).render("blogs/blogsNotFound", {
                title: "Blogs Not Found",
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(e.code).render("blogs/blogsNotFound", {
                title: "Blogs Not Found",
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });


        }
    }
})

// Create a route to get a blog by id
router.route("/:id").get(async (req, res) => {

    try {
        let id = req.params.id;
        //Validate the id
        let blogData = await blogs.getBlogById(id);


        if (req.session.userdata) {

            return res.status(200).render("blogs/blogsData", {
                title: blogData.blog_name,
                blog: blogData,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(200).render("blogs/blogsData", {
                title: blogData.blog_name,
                blog: blogData,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
    catch (e) {
        res.status(e.code).json(e.message);
    }
})

// Create a route to get all the blogs of a particular Category
router.route("/category/:id").get(async (req, res) => {
    try {

        let id = req.params.id;
        //Validate the id
        let blogsData = await blogs.getBlogByCategoryId(id);

        //Get the blogCategory name
        let blogCategoryId = blogsData[0].blog_category_id.toString();

        let name = await blogs.getBlogCategoryName(blogCategoryId);

        if (req.session.userdata) {
            return res.status(200).render("blogs/blogsList", {
                title: name.name,
                blogs: blogsData,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(200).render("blogs/blogsList", {
                title: name.name,
                blogs: blogsData,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
    catch (e) {

        if (req.session.userdata) {

            return res.status(404).render("blogs/blogsNotFound", {
                title: "BlogNotfound",
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(404).render("blogs/blogsNotFound", {
                title: "BlogNotfound",
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
})

module.exports = router;
