const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const { ObjectId } = require("mongodb");
const Helper = require("../helpers");
const moment = require("moment");

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

  Helper.CheckString(title, Object.keys({ title })[0]);
  Helper.CheckString(plot, Object.keys({ plot })[0]);
  Helper.CheckString(rating, Object.keys({ rating })[0]);
  Helper.CheckString(studio, Object.keys({ studio })[0]);
  Helper.CheckString(director, Object.keys({ director })[0]);
  Helper.CheckString(dateReleased, Object.keys({ dateReleased })[0]);
  Helper.CheckString(runtime, Object.keys({ runtime })[0]);

  Helper.CheckFormat(title, Object.keys({ title })[0], true, 2);
  Helper.CheckFormat(studio, Object.keys({ studio })[0], false, 5);

  /** director */
  let names = [];
  director = director.trim();
  names = director.split(" ");
  if (names.length !== 2) {
    throw "director name must be in proper format, i.e. (firstname lastname)";
  }
  let FirstName = names[0].toString();
  let LastName = names[1].toString();
  Helper.CheckFormat(FirstName, "director's Firstname", false, 3);
  Helper.CheckFormat(LastName, "director's Lastname", false, 3);

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
    Helper.CheckString(Genres, "genres");
    Helper.CheckFormat(Genres, "genres", false, 5);
  });
  /** castMembers */
  if (Array.isArray(castMembers) === false) {
    throw "Type of cast members Must be an Array!";
  }
  if (castMembers.length === 0) {
    throw "Cast members must not be empty!";
  }
  castMembers.forEach((Cast_Member) => {
    Helper.CheckString(Cast_Member, "Each cast members");

    let names = [];
    Cast_Member = Cast_Member.trim();
    names = Cast_Member.split(" ");
    if (names.length !== 2) {
      throw "Cast Member names must be in proper format, i.e. (firstname lastname)";
    }
    let FirstName = names[0].toString();
    let LastName = names[1].toString();
    Helper.CheckFormat(FirstName, "Firstname of the cast member", false, 3);
    Helper.CheckFormat(LastName, "Lastname of the cast member", false, 3);
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
  Helper.CheckID(id);
  id = id.trim();

  const movieCollection = await movies();
  const SearchedMovie = await movieCollection.findOne({ _id: ObjectId(id) });
  if (SearchedMovie === null) throw "No Movie found with that id";
  SearchedMovie["_id"] = id;
  return SearchedMovie;
};

const removeMovie = async (id) => {
  Helper.CheckID(id);
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

const renameMovie = async (id, newName) => {
  Helper.CheckID(id);
  id = id.trim();

  Helper.CheckString(newName, Object.keys({ newName })[0]);
  Helper.CheckFormat(newName, Object.keys({ newName })[0], true, 2);

  newName = newName.trim();

  const movieCollection = await movies();

  const SearchedMovie = await movieCollection.findOne({ _id: ObjectId(id) });

  if (SearchedMovie === null) throw "No Movie found with that id";

  let movie_name = SearchedMovie.title.toString();

  if (movie_name === newName)
    throw "There is nothing to Update, new title is same as current title.";

  const updatedMovie = {
    title: newName,
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

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  renameMovie,
};
