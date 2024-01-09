const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");
const product = data.products;
const blog = data.blogs;



//Get the Blogs category 
router.route("/blogs/category").get(async (req, res) => {

    let blogs_category;
    try {
        blogs_category = await blog.getAllBlogCategories();
        return res.status(200).json(blogs_category);
    }
    catch (e) {

        return res.status(e.code).json(e.message);
    }
})

module.exports = router;