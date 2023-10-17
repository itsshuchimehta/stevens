const express = require("express");
const router = express.Router();
const data = require("../data");
const movieData = data.movies;
const validation = require("../helpers");
const moment = require("moment");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const movieList = await movieData.getAllMovies();
      let movieArr = [];
      if (movieList.length > 0) {
        movieList.forEach((movie) => {
          movieArr.push({ _id: movie._id, title: movie.title });
        });
      }
      res.json(movieArr);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const moviePostData = req.body;
    try {
      if (
        !moviePostData.title ||
        !moviePostData.plot ||
        !moviePostData.genres ||
        !moviePostData.rating ||
        !moviePostData.studio ||
        !moviePostData.director ||
        !moviePostData.castMembers ||
        !moviePostData.dateReleased ||
        !moviePostData.runtime
      )
        throw "All fields need to have valid values";

      validation.CheckString(moviePostData.title, "title");
      validation.CheckString(moviePostData.plot, "plot");
      validation.CheckString(moviePostData.rating, "rating");
      validation.CheckString(moviePostData.studio, "studio");
      validation.CheckString(moviePostData.director, "director");
      validation.CheckString(moviePostData.dateReleased, "dateReleased");
      validation.CheckString(moviePostData.runtime, "runtime");

      validation.CheckFormat(moviePostData.title, "title", true, 2);
      validation.CheckFormat(moviePostData.studio, "studio", false, 5);

      /** director */
      let names = [];
      moviePostData.director = moviePostData.director.trim();
      names = moviePostData.director.split(" ");
      if (names.length !== 2) {
        throw "director name must be in proper format, i.e. (firstname lastname)";
      }
      let FirstName = names[0].toString();
      let LastName = names[1].toString();
      validation.CheckFormat(FirstName, "director's Firstname", false, 3);
      validation.CheckFormat(LastName, "director's Lastname", false, 3);

      /** rating */
      const ratingValues = ["G", "PG", "PG-13", "R", "NC-17"];
      moviePostData.rating = moviePostData.rating.trim();
      if (ratingValues.includes(moviePostData.rating) === false)
        throw "Rating can only be one of this (G, PG, PG-13, R, NC-17)";

      /** genres */
      if (Array.isArray(moviePostData.genres) === false) {
        throw "Type of genres Must be an Array!";
      }
      if (moviePostData.genres.length === 0) {
        throw "genres must not be empty!";
      }
      moviePostData.genres.forEach((Genres) => {
        validation.CheckString(Genres, "genres");
        validation.CheckFormat(Genres, "genres", false, 5);
      });
      /** castMembers */
      if (Array.isArray(moviePostData.castMembers) === false) {
        throw "Type of cast members Must be an Array!";
      }
      if (moviePostData.castMembers.length === 0) {
        throw "Cast members must not be empty!";
      }
      moviePostData.castMembers.forEach((Cast_Member) => {
        validation.CheckString(Cast_Member, "Each cast members");

        let names = [];
        Cast_Member = Cast_Member.trim();
        names = Cast_Member.split(" ");
        if (names.length !== 2) {
          throw "Cast Member names must be in proper format, i.e. (firstname lastname)";
        }
        let FirstName = names[0].toString();
        let LastName = names[1].toString();
        validation.CheckFormat(
          FirstName,
          "Firstname of the cast member",
          false,
          3
        );
        validation.CheckFormat(
          LastName,
          "Lastname of the cast member",
          false,
          3
        );
      });

      /** dateReleased */
      if (
        moment(moviePostData.dateReleased, "MM/DD/YYYY", true).isValid() !==
        true
      )
        throw "dateReleased must be a valid date";
      let curr_year = new Date().getFullYear();
      let YearCheck = moment(moviePostData.dateReleased, "MM/DD/YYYY").year();

      if (YearCheck < 1900 || YearCheck > curr_year + 2)
        throw (
          "The year of dateReleased must be between 1990 - " + (curr_year + 2)
        );

      /** runtime */
      moviePostData.runtime = moviePostData.runtime.trim();
      let runtime_Arr = moviePostData.runtime.split(" ");
      if (runtime_Arr.length !== 2)
        throw "Runtime must be in proper format, i.e. (#h #min)";
      let hr = runtime_Arr[0].toString();
      let min = runtime_Arr[1].toString();
      if (hr.includes("h") === true) {
        hr = hr.replace("h", "");
        if (
          parseFloat(hr) < 0 ||
          parseFloat(hr) > 12 ||
          parseFloat(hr) % 1 !== 0
        )
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

      moviePostData.title = moviePostData.title.trim();
      moviePostData.plot = moviePostData.plot.trim();
      moviePostData.rating = moviePostData.rating.trim();
      moviePostData.studio = moviePostData.studio.trim();
      moviePostData.director = moviePostData.director.trim();
      moviePostData.runtime = parseInt(hr) + "h " + parseInt(min) + "min";
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const {
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = moviePostData;
      const newMovie = await movieData.createMovie(
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime
      );
      res.status(200).json(newMovie);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

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
      res.json(movie);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.movieId = validation.checkId(
        req.params.movieId,
        "Id URL Param"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      return res.status(404).json({ error: "Movie not found" });
    }
    try {
      await movieData.removeMovie(req.params.movieId);
      res.status(200).json({ movieId: req.params.movieId, deleted: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .put(async (req, res) => {
    try {
      req.params.movieId = validation.checkId(
        req.params.movieId,
        "Id URL Param"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    const updatedData = req.body;
    try {
      /** Validations */

      if (
        !updatedData.title ||
        !updatedData.plot ||
        !updatedData.genres ||
        !updatedData.rating ||
        !updatedData.studio ||
        !updatedData.director ||
        !updatedData.castMembers ||
        !updatedData.dateReleased ||
        !updatedData.runtime
      )
        throw "All fields need to have valid values";
      validation.CheckString(updatedData.title, "title");
      validation.CheckString(updatedData.plot, "plot");
      validation.CheckString(updatedData.rating, "rating");
      validation.CheckString(updatedData.studio, "studio");
      validation.CheckString(updatedData.director, "director");
      validation.CheckString(updatedData.dateReleased, "dateReleased");
      validation.CheckString(updatedData.runtime, "runtime");

      validation.CheckFormat(updatedData.title, "title", true, 2);
      validation.CheckFormat(updatedData.studio, "studio", false, 5);

      /** director */
      let names = [];
      updatedData.director = updatedData.director.trim();
      names = updatedData.director.split(" ");
      if (names.length !== 2) {
        throw "director name must be in proper format, i.e. (firstname lastname)";
      }
      let FirstName = names[0].toString();
      let LastName = names[1].toString();
      validation.CheckFormat(FirstName, "director's Firstname", false, 3);
      validation.CheckFormat(LastName, "director's Lastname", false, 3);

      /** rating */
      const ratingValues = ["G", "PG", "PG-13", "R", "NC-17"];
      updatedData.rating = updatedData.rating.trim();
      if (ratingValues.includes(updatedData.rating) === false)
        throw "Rating can only be one of this (G, PG, PG-13, R, NC-17)";

      /** genres */
      if (Array.isArray(updatedData.genres) === false) {
        throw "Type of genres Must be an Array!";
      }
      if (updatedData.genres.length === 0) {
        throw "genres must not be empty!";
      }
      updatedData.genres.forEach((Genres) => {
        validation.CheckString(Genres, "genres");
        validation.CheckFormat(Genres, "genres", false, 5);
      });
      /** castMembers */
      if (Array.isArray(updatedData.castMembers) === false) {
        throw "Type of cast members Must be an Array!";
      }
      if (updatedData.castMembers.length === 0) {
        throw "Cast members must not be empty!";
      }
      updatedData.castMembers.forEach((Cast_Member) => {
        validation.CheckString(Cast_Member, "Each cast members");

        let names = [];
        Cast_Member = Cast_Member.trim();
        names = Cast_Member.split(" ");
        if (names.length !== 2) {
          throw "Cast Member names must be in proper format, i.e. (firstname lastname)";
        }
        let FirstName = names[0].toString();
        let LastName = names[1].toString();
        validation.CheckFormat(
          FirstName,
          "Firstname of the cast member",
          false,
          3
        );
        validation.CheckFormat(
          LastName,
          "Lastname of the cast member",
          false,
          3
        );
      });

      /** dateReleased */
      if (
        moment(updatedData.dateReleased, "MM/DD/YYYY", true).isValid() !== true
      )
        throw "dateReleased must be a valid date";
      let curr_year = new Date().getFullYear();
      let YearCheck = moment(updatedData.dateReleased, "MM/DD/YYYY").year();

      if (YearCheck < 1900 || YearCheck > curr_year + 2)
        throw (
          "The year of dateReleased must be between 1990 - " + (curr_year + 2)
        );

      /** runtime */
      updatedData.runtime = updatedData.runtime.trim();
      let runtime_Arr = updatedData.runtime.split(" ");
      if (runtime_Arr.length !== 2)
        throw "Runtime must be in proper format, i.e. (#h #min)";
      let hr = runtime_Arr[0].toString();
      let min = runtime_Arr[1].toString();
      if (hr.includes("h") === true) {
        hr = hr.replace("h", "");
        if (
          parseFloat(hr) < 0 ||
          parseFloat(hr) > 12 ||
          parseFloat(hr) % 1 !== 0
        )
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
      updatedData.movieId = req.params.movieId.trim();
      updatedData.title = updatedData.title.trim();
      updatedData.plot = updatedData.plot.trim();
      updatedData.genres = updatedData.genres;
      updatedData.rating = updatedData.rating.trim();
      updatedData.studio = updatedData.studio.trim();
      updatedData.director = updatedData.director.trim();
      updatedData.castMembers = updatedData.castMembers;
      updatedData.dateReleased = updatedData.dateReleased;
      updatedData.runtime = parseInt(hr) + "h " + parseInt(min) + "min";
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      return res.status(404).json({ error: "Movie not found" });
    }

    try {
      const {
        movieId,
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = updatedData;
      const updatedMovie = await movieData.updateMovie(
        req.params.movieId,
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime
      );
      res.status(200).json(updatedMovie);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
module.exports = router;
