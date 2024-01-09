const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data");
const product = data.products;
const user = data.users;
const xss = require("xss");
const { users } = require("../data");

//Get all the products
router.route("/").get(async (req, res) => {

    try {
        //validating the id;
        let allProducts = await product.getAllProducts();

        if (req.session.userdata) {
            return res.status(200).render("products/products", {
                title: "Products",
                products: allProducts,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {
            return res.status(200).render("products/products", {
                title: "Products",
                products: allProducts,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,

            });
        }
    }

    catch (e) {

        if (req.session.userdata) {
            return res.status(e.code).render("products/productsNotFound", {
                title: "Not found",
                message: e.message,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(e.code).render("products/productsNotFound", {
                title: "Not found",
                message: e.message,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
})

// Get all the products by Name
router.route("/searchByName").post(async (req, res) => {

    try {

        let name = xss(req.body.search);
        //Checking to validate the id

        let getProductByName = await product.getProductByName(name);

        if (req.session.userdata) {
            return res.status(200).render("products/products", {

                title: "Product Found",
                products: getProductByName,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {
            return res.status(200).render("products/products", {

                title: "Product Found",
                products: getProductByName,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
    catch (e) {

        if (req.session.userdata) {
            return res.status(e.code).render("products/productsNotFound", {
                title: "Not found",
                message: e.message,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(e.code).render("products/productsNotFound", {
                title: "Not found",
                message: e.message,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
})

// Get the product by id
router.route("/:id").get(async (req, res) => {

    try {


        let id = xss(req.params.id);
        //Getting the product by Particular Id
        let getProductById = await product.getProductById(id);

        //Get the all the users
        let getAllUsersName = await users.getAllUsersByName();

        //Create an array of object to store the name along with the comments;

        let usersWithComments;
        if (getProductById && getAllUsersName)
            usersWithComments = await users.getUserNameWithComments(getProductById, getAllUsersName);

        if (req.session.userdata) {
            req.session.productId = getProductById._id;
            return res.status(200).render("products/productDetail", {

                title: getProductById.name,
                product: getProductById,
                comments: usersWithComments,
                user_header: true,
                user_footer: true,
                loggedIn: true,
                UserFullname: req.session.other.UserFullname,
                profileimage: req.session.other.profileimage,
            });
        }

        else {

            return res.status(200).render("products/productDetail", {

                title: getProductById.name,
                product: getProductById,
                comments: usersWithComments,
                user_header: true,
                user_footer: true,
                NotloggedIn: true,
            });
        }
    }
    catch (e) {
        res.status(e.code).render("products/productsNotFound", {
            title: "Not found",
            message: e.message,
            user_header: true,
            user_footer: true,
            NotloggedIn: true,
        })
    }
})

// Add the like
router.route("/addLike").post(async (req, res) => {

    try {

        let commentId = xss(req.body.commentId);
        let productId = req.session.productId;
        let userId = req.session.userdata.user_id;

        let result = await product.addLikeProduct(commentId, productId, userId);

        return res.status(200).json({
            result
        })
    }

    catch (e) {

        return res.status(200).json({
            status: false
        })
    }
})

// Add the dislike
router.route("/addDislike").post(async (req, res) => {

    try {

        let commentId = xss(req.body.commentId);
        let productId = req.session.productId;
        let userId = req.session.userdata.user_id;

        let result = await product.addDislikeProduct(commentId, productId, userId);

        return res.status(200).json({
            result
        })
    }

    catch (e) {

        return res.status(200).json({
            status: false
        })
    }
})



module.exports = router;