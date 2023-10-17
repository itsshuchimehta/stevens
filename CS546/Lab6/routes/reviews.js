const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;
const movieData = data.movies;
const validation = require("../helpers");

router
  .route("/:movieId")
  .get(async (req, res) => {
    try {
      req.params.movieId = validation.checkId(
        req.params.movieId,
        "Id URL Param"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const movie = await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      res.status(404).json({ error: e });
    }
    try {
      const reviews = await reviewData.getAllReviews(req.params.movieId);
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const reviewPostData = req.body;
    try {
      if (
        !reviewPostData.reviewTitle ||
        !reviewPostData.reviewerName ||
        !reviewPostData.review ||
        !reviewPostData.rating
      )
        throw "All fields need to have valid values";

      validation.CheckString(reviewPostData.reviewTitle, "reviewTitle");
      validation.CheckString(reviewPostData.reviewerName, "reviewerName");
      validation.CheckString(reviewPostData.review, "review");

      /** rating */
      if (typeof reviewPostData.rating !== "number")
        throw "Rating should be a number value";
      if (reviewPostData.rating < 1 || reviewPostData.rating > 5)
        throw "Rating must be betwwn 1 to 5";
      if (reviewPostData.rating % 1 !== 0) {
        if (
          reviewPostData.rating.toFixed(1) < 1.5 ||
          reviewPostData.rating.toFixed(1) > 4.8
        )
          throw "Rating must be between 1.5 to 4.8";
      }
      if (reviewPostData.rating % 1 !== 0)
        reviewPostData.rating = Number(reviewPostData.rating.toFixed(1));
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      return res.status(404).json({ error: "Movie not found" });
    }
    try {
      const { reviewTitle, reviewerName, review, rating } = reviewPostData;
      const newReview = await reviewData.createReview(
        req.params.movieId,
        reviewTitle,
        reviewerName,
        review,
        rating
      );
      res.status(200).json(newReview);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .route("/review/:reviewId")
  .get(async (req, res) => {
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        "Id URL Param"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const reviews = await reviewData.getReview(req.params.reviewId);
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        "Id URL Param"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const reviews = await reviewData.getReview(req.params.reviewId);
    } catch (e) {
      res.status(404).json({ error: e });
    }
    try {
      const reviews = await reviewData.removeReview(req.params.reviewId);
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });
module.exports = router;
