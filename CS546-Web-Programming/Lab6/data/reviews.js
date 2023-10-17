const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const { ObjectId } = require("mongodb");
const validation = require("../helpers");
const moment = require("moment");

const createReview = async (
  movieId,
  reviewTitle,
  reviewerName,
  review,
  rating
) => {
  if (!movieId || !reviewTitle || !reviewerName || !review || !rating)
    throw "All fields need to have valid values";

  validation.checkId(movieId, "MovieID");
  validation.CheckString(movieId, "movieId");
  validation.CheckString(reviewTitle, "reviewTitle");
  validation.CheckString(reviewerName, "reviewerName");
  validation.CheckString(review, "review");
  movieId = movieId.trim();

  /** rating */
  if (typeof rating !== "number") throw "Rating should be a number value";
  if (rating < 1 || rating > 5) throw "Rating must be betwwn 1 to 5";
  if (rating % 1 !== 0) {
    if (rating.toFixed(1) < 1.5 || rating.toFixed(1) > 4.8)
      throw "Rating must be between 1.5 to 4.8";
  }
  if (rating % 1 !== 0) rating = Number(rating.toFixed(1));

  const movieCollection = await movies();
  const SearchedMovie = await movieCollection.findOne({
    _id: ObjectId(movieId),
  });
  if (SearchedMovie === null) throw "No Movie found with that movieId";

  const newReview = {
    _id: ObjectId(),
    reviewTitle: reviewTitle,
    reviewDate: moment().format("MM/DD/YYYY").toString(),
    reviewerName: reviewerName,
    review: review,
    rating: rating,
  };
  let allReviews = [];
  allReviews = await getAllReviews(movieId);
  let totalRating = 0;
  let i = 1;
  totalRating = Number(newReview.rating);
  if (Number(allReviews.length) > 0) {
    allReviews.forEach((r) => {
      totalRating = Number(totalRating) + Number(r.rating);
      i++;
    });
    if (totalRating > 0) {
      totalRating = (Number(totalRating) / i).toFixed(1);
    }
  }
  const updatedInfo = await movieCollection.updateOne(
    { _id: ObjectId(movieId) },
    { $push: { reviews: newReview } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update movie successfully";
  }
  const updatedMovie = {
    overallRating: Number(totalRating),
  };
  const updatedoverallRating = await movieCollection.updateOne(
    { _id: ObjectId(movieId) },
    { $set: updatedMovie }
  );

  let finalMovie = await movieCollection.findOne({
    _id: ObjectId(movieId),
  });
  finalMovie["_id"] = movieId;
  ReviewsArr = finalMovie.reviews;
  ReviewsArr.forEach((arr) => {
    let id = arr._id.toString();
    id = id.replace("new ObjectId(", "");
    id = id.replace(")", "");
    arr._id = id;
  });
  finalMovie["reviews"] = ReviewsArr;

  return finalMovie;
};

const getAllReviews = async (movieId) => {
  if (!movieId) throw "movieId must be provided";
  validation.checkId(movieId, "MovieID");
  validation.CheckString(movieId, "movieId");
  let ReviewsArr = [];
  const movieCollection = await movies();
  const SearchedMovie = await movieCollection.findOne({
    _id: ObjectId(movieId),
  });
  if (SearchedMovie === null) throw "No Movie found with that movieId";
  ReviewsArr = SearchedMovie.reviews;
  ReviewsArr.forEach((arr) => {
    let id = arr._id.toString();
    id = id.replace("new ObjectId(", "");
    id = id.replace(")", "");
    arr._id = id;
  });
  return ReviewsArr;
};

const getReview = async (reviewId) => {
  if (!reviewId) throw "reviewId must be provided";
  validation.checkId(reviewId, "ReviewID");
  validation.CheckString(reviewId, "reviewId");
  let ReviewsArr = [];
  let review = {};
  const movieCollection = await movies();

  const SearchedReview = await movieCollection.findOne({
    reviews: { $elemMatch: { _id: ObjectId(reviewId) } },
  });
  if (SearchedReview === null) throw "No Review found with that reviewId";
  ReviewsArr = SearchedReview.reviews;
  ReviewsArr.forEach((arr) => {
    let id = arr._id.toString();
    id = id.replace("new ObjectId(", "");
    id = id.replace(")", "");
    arr._id = id;
    if (id === reviewId) {
      review = arr;
    }
  });
  return review;
};

const removeReview = async (reviewId) => {
  if (!reviewId) throw "reviewId must be provided";
  validation.checkId(reviewId, "ReviewID");
  validation.CheckString(reviewId, "reviewId");
  let ReviewsArr = [];
  let review = {};
  const movieCollection = await movies();

  const SearchedReview = await movieCollection.findOne({
    reviews: { $elemMatch: { _id: ObjectId(reviewId) } },
  });
  if (SearchedReview === null) throw "No Review found with that reviewId";

  const deletedReview = await movieCollection.updateMany(
    {},
    {
      $pull: {
        reviews: { _id: ObjectId(reviewId) },
      },
    }
  );
  let movieid = SearchedReview._id.toString();
  movieid = movieid.replace("new ObjectId(", "");
  movieid = movieid.replace(")", "");

  let theMovie = await movieCollection.findOne({
    _id: ObjectId(movieid),
  });

  let allReviews = [];
  allReviews = theMovie.reviews;
  let totalRating = 0;
  let i = allReviews.length;

  if (i > 0) {
    allReviews.forEach((r) => {
      totalRating = Number(totalRating) + Number(r.rating);
    });
    if (totalRating > 0) {
      totalRating = (Number(totalRating) / i).toFixed(1);
    }
  }
  const updatedMovie = {
    overallRating: Number(totalRating),
  };
  const updatedoverallRating = await movieCollection.updateOne(
    { _id: ObjectId(movieid) },
    { $set: updatedMovie }
  );

  let finalMovie = await movieCollection.findOne({
    _id: ObjectId(movieid),
  });
  finalMovie["_id"] = movieid;
  ReviewsArr = finalMovie.reviews;
  ReviewsArr.forEach((arr) => {
    let id = arr._id.toString();
    id = id.replace("new ObjectId(", "");
    id = id.replace(")", "");
    arr._id = id;
  });
  finalMovie["reviews"] = ReviewsArr;

  return finalMovie;
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
};
