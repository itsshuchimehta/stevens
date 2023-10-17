const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const reviews = require("./reviews");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const validation = require("../helpers");

const createMovie = async (
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  /** Validations */
  if (
    !title ||
    !plot ||
    !genres ||
    !rating ||
    !studio ||
    !director ||
    !castMembers ||
    !dateReleased ||
    !runtime
  )
    throw "All fields need to have valid values";

  validation.CheckString(title, Object.keys({ title })[0]);
  validation.CheckString(plot, Object.keys({ plot })[0]);
  validation.CheckString(rating, Object.keys({ rating })[0]);
  validation.CheckString(studio, Object.keys({ studio })[0]);
  validation.CheckString(director, Object.keys({ director })[0]);
  validation.CheckString(dateReleased, Object.keys({ dateReleased })[0]);
  validation.CheckString(runtime, Object.keys({ runtime })[0]);

  validation.CheckFormat(title, Object.keys({ title })[0], true, 2);
  validation.CheckFormat(studio, Object.keys({ studio })[0], false, 5);

  /** director */
  let names = [];
  director = director.trim();
  names = director.split(" ");
  if (names.length !== 2) {
    throw "director name must be in proper format, i.e. (firstname lastname)";
  }
  let FirstName = names[0].toString();
  let LastName = names[1].toString();
  validation.CheckFormat(FirstName, "director's Firstname", false, 3);
  validation.CheckFormat(LastName, "director's Lastname", false, 3);

  /** rating */
  const ratingValues = ["G", "PG", "PG-13", "R", "NC-17"];
  rating = rating.trim();
  if (ratingValues.includes(rating) === false)
    throw "Rating can only be one of this (G, PG, PG-13, R, NC-17)";

  /** genres */
  if (Array.isArray(genres) === false) {
    throw "Type of genres Must be an Array!";
  }
  if (genres.length === 0) {
    throw "genres must not be empty!";
  }
  genres.forEach((Genres) => {
    validation.CheckString(Genres, "genres");
    validation.CheckFormat(Genres, "genres", false, 5);
  });
  /** castMembers */
  if (Array.isArray(castMembers) === false) {
    throw "Type of cast members Must be an Array!";
  }
  if (castMembers.length === 0) {
    throw "Cast members must not be empty!";
  }
  castMembers.forEach((Cast_Member) => {
    validation.CheckString(Cast_Member, "Each cast members");

    let names = [];
    Cast_Member = Cast_Member.trim();
    names = Cast_Member.split(" ");
    if (names.length !== 2) {
      throw "Cast Member names must be in proper format, i.e. (firstname lastname)";
    }
    let FirstName = names[0].toString();
    let LastName = names[1].toString();
    validation.CheckFormat(FirstName, "Firstname of the cast member", false, 3);
    validation.CheckFormat(LastName, "Lastname of the cast member", false, 3);
  });

  /** dateReleased */
  if (moment(dateReleased, "MM/DD/YYYY", true).isValid() !== true)
    throw "dateReleased must be a valid date";
  let curr_year = new Date().getFullYear();
  let YearCheck = moment(dateReleased, "MM/DD/YYYY").year();

  if (YearCheck < 1900 || YearCheck > curr_year + 2)
    throw "The year of dateReleased must be between 1990 - " + (curr_year + 2);

  /** runtime */
  runtime = runtime.trim();
  let runtime_Arr = runtime.split(" ");
  if (runtime_Arr.length !== 2)
    throw "Runtime must be in proper format, i.e. (#h #min)";
  let hr = runtime_Arr[0].toString();
  let min = runtime_Arr[1].toString();
  if (hr.includes("h") === true) {
    hr = hr.replace("h", "");
    if (parseFloat(hr) < 0 || parseFloat(hr) > 12 || parseFloat(hr) % 1 !== 0)
      throw "runtime hr must be valid";
    if (parseFloat(hr) === 0) throw "runtime must be at least 1h";
  } else {
    throw "Runtime must be in proper format, i.e. (#h #min)";
  }
  if (min.includes("min") === true) {
    min = min.replace("min", "");
    if (
      parseFloat(min) < 0 ||
      parseFloat(min) > 59 ||
      parseFloat(min) % 1 !== 0
    )
      throw "runtime min must be valid";
  } else {
    throw "Runtime must be in proper format, i.e. (#h #min)";
  }

  title = title.trim();
  plot = plot.trim();
  rating = rating.trim();
  studio = studio.trim();
  director = director.trim();

  runtime = parseInt(hr) + "h " + parseInt(min) + "min";

  const movieCollection = await movies();

  let newMovie = {
    title: title,
    plot: plot,
    genres: genres,
    rating: rating,
    studio: studio,
    director: director,
    castMembers: castMembers,
    dateReleased: dateReleased,
    runtime: runtime,
    reviews: [],
    overallRating: 0,
  };

  const insertInfo = await movieCollection.insertOne(newMovie);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add movie";

  const newId = insertInfo.insertedId.toString();

  const InsertedMovie = await getMovieById(newId);
  return InsertedMovie;
};

const getAllMovies = async () => {
  const movieCollection = await movies();
  const MovieList = await movieCollection.find({}).toArray();
  for (let i = 0; i < MovieList.length; i++) {
    MovieList[i]._id = ObjectId(MovieList[i]._id).toString();
  }
  return MovieList;
};

const getMovieById = async (id) => {
  validation.checkId(id, "MovieID");
  id = id.trim();

  const movieCollection = await movies();
  const SearchedMovie = await movieCollection.findOne({ _id: ObjectId(id) });
  if (SearchedMovie === null) throw "No Movie found with that id";
  SearchedMovie["_id"] = id;
  return SearchedMovie;
};

const removeMovie = async (id) => {
  validation.checkId(id, "MovieID");
  id = id.trim();

  const movieCollection = await movies();
  const SearchedMovie = await movieCollection.findOne({ _id: ObjectId(id) });

  if (SearchedMovie === null) throw "No Movie found with that id";
  let movie_name = SearchedMovie.title.toString();
  const deletionInfo = await movieCollection.deleteOne({ _id: ObjectId(id) });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }

  let result = movie_name + " has been successfully deleted!";

  return result;
};

const updateMovie = async (
  movieId,
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  /** Validations */
  if (
    !movieId ||
    !title ||
    !plot ||
    !genres ||
    !rating ||
    !studio ||
    !director ||
    !castMembers ||
    !dateReleased ||
    !runtime
  )
    throw "All fields need to have valid values";
  validation.checkId(movieId, "MovieID");
  validation.CheckString(title, "title");
  validation.CheckString(plot, "plot");
  validation.CheckString(rating, "rating");
  validation.CheckString(studio, "studio");
  validation.CheckString(director, "director");
  validation.CheckString(dateReleased, "dateReleased");
  validation.CheckString(runtime, "runtime");

  validation.CheckFormat(title, "title", true, 2);
  validation.CheckFormat(studio, "studio", false, 5);

  /** director */
  let names = [];
  director = director.trim();
  names = director.split(" ");
  if (names.length !== 2) {
    throw "director name must be in proper format, i.e. (firstname lastname)";
  }
  let FirstName = names[0].toString();
  let LastName = names[1].toString();
  validation.CheckFormat(FirstName, "director's Firstname", false, 3);
  validation.CheckFormat(LastName, "director's Lastname", false, 3);

  /** rating */
  const ratingValues = ["G", "PG", "PG-13", "R", "NC-17"];
  rating = rating.trim();
  if (ratingValues.includes(rating) === false)
    throw "Rating can only be one of this (G, PG, PG-13, R, NC-17)";

  /** genres */
  if (Array.isArray(genres) === false) {
    throw "Type of genres Must be an Array!";
  }
  if (genres.length === 0) {
    throw "genres must not be empty!";
  }
  genres.forEach((Genres) => {
    validation.CheckString(Genres, "genres");
  });
  /** castMembers */
  if (Array.isArray(castMembers) === false) {
    throw "Type of cast members Must be an Array!";
  }
  if (castMembers.length === 0) {
    throw "Cast members must not be empty!";
  }
  castMembers.forEach((Cast_Member) => {
    validation.CheckString(Cast_Member, "Each cast members");
  });

  /** dateReleased */
  if (moment(dateReleased, "MM/DD/YYYY", true).isValid() !== true)
    throw "dateReleased must be a valid date";
  let curr_year = new Date().getFullYear();
  let YearCheck = moment(dateReleased, "MM/DD/YYYY").year();

  if (YearCheck < 1900 || YearCheck > curr_year + 2)
    throw "The year of dateReleased must be between 1990 - " + (curr_year + 2);

  /** runtime */
  runtime = runtime.trim();
  let runtime_Arr = runtime.split(" ");
  if (runtime_Arr.length !== 2)
    throw "Runtime must be in proper format, i.e. (#h #min)";
  let hr = runtime_Arr[0].toString();
  let min = runtime_Arr[1].toString();
  if (hr.includes("h") === true) {
    hr = hr.replace("h", "");
    if (parseFloat(hr) < 0 || parseFloat(hr) > 12 || parseFloat(hr) % 1 !== 0)
      throw "runtime hr must be valid";
    if (parseFloat(hr) === 0) throw "runtime must be at least 1h";
  } else {
    throw "Runtime must be in proper format, i.e. (#h #min)";
  }
  if (min.includes("min") === true) {
    min = min.replace("min", "");
    if (
      parseFloat(min) < 0 ||
      parseFloat(min) > 59 ||
      parseFloat(min) % 1 !== 0
    )
      throw "runtime min must be valid";
  } else {
    throw "Runtime must be in proper format, i.e. (#h #min)";
  }
  id = movieId.trim();
  title = title.trim();
  plot = plot.trim();
  rating = rating.trim();
  studio = studio.trim();
  director = director.trim();
  runtime = parseInt(hr) + "h " + parseInt(min) + "min";

  const movieCollection = await movies();

  const SearchedMovie = await movieCollection.findOne({ _id: ObjectId(id) });

  if (SearchedMovie === null) throw "No Movie found with that id";

  let movie_name = SearchedMovie.title.toString();
  let movie_plot = SearchedMovie.plot.toString();
  let movie_rating = SearchedMovie.rating.toString();
  let movie_studio = SearchedMovie.studio.toString();
  let movie_director = SearchedMovie.director.toString();
  let movie_runtime = SearchedMovie.runtime.toString();
  let movie_dateReleased = SearchedMovie.dateReleased.toString();

  let movie_genres = validation.CheckArrareEqual(SearchedMovie.genres, genres);

  let movie_castMembers = validation.CheckArrareEqual(
    SearchedMovie.castMembers,
    castMembers
  );
  if (
    movie_name === title &&
    movie_plot === plot &&
    movie_rating === rating &&
    movie_studio === studio &&
    movie_director === director &&
    movie_runtime === runtime &&
    movie_dateReleased === dateReleased &&
    movie_genres === true &&
    movie_castMembers === true
  )
    throw "There is nothing to Update, each field has same values as saved before.";

  const updatedMovie = {
    title: title,
    plot: plot,
    rating: rating,
    studio: studio,
    director: director,
    runtime: runtime,
    dateReleased: dateReleased,
    genres: genres,
    castMembers: castMembers,
  };

  const updatedInfo = await movieCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedMovie }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update movie successfully";
  }

  return await getMovieById(id);
};

const renameMovie = async (id, newName) => {
  //Not used for this lab
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  updateMovie,
  renameMovie,
};
