const movies = require("./data/movies");
const connection = require("./config/mongoConnection");
const main = async () => {
  const db = await connection.dbConnection();
  await db.dropDatabase();
  let MovieOne = undefined;
  let MovieTwo = undefined;
  let MovieThird = undefined;

  try {
    //1. Create a Movie of your choice.
    MovieOne = await movies.createMovie(
      "Slumdog Millionaire",
      "As 18-year-old Jamal Malik (Dev Patel) answers questions on the Indian version of Who Wants to Be a Millionaire, flashbacks show how he got there. ",
      ["Comedy", "Drama", "Thriller"],
      "PG",
      "Warner Independent Pictures",
      "Danny Boyle",
      ["Dev Patel", "Freida Pinto", "Irrfan Khan", "Tanay Chheda"],
      "01/23/2009",
      "2h 0min"
    );
    //  2. Log the newly created Movie. (Just that movie, not all movies)
    console.log(MovieOne);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //  3. Create another movie of your choice.
    MovieTwo = await movies.createMovie(
      "Titanic",
      "James Cameron's Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.",
      ["Romance", "Drama", "Disaster"],
      "PG-13",
      "Paramount Pictures",
      "James Cameron",
      ["Kate Winslet", "Leonardo DiCaprio", "Billy Zane"],
      "12/19/1997",
      "2h 58min"
    );
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //  4. Query all movies, and log them all
    const allMovies = await movies.getAllMovies();
    console.log(allMovies);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //  5. Create the 3rd movie of your choice.
    MovieThird = await movies.createMovie(
      "Avatar",
      "On the lush alien world of Pandora live the Na'vi, beings who appear primitive but are highly evolved. Because the planet's environment is poisonous, human/Na'vi hybrids, called Avatars, must link to human minds to allow for free movement on Pandora. Jake Sully (Sam Worthington), a paralyzed former Marine, becomes mobile again through one such Avatar and falls in love with a Na'vi woman (Zoe Saldana). As a bond with her grows, he is drawn into a battle for the survival of her world.",
      ["Action", "Advenrure", "Mystery"],
      "PG-13",
      "Lightstorm Entertainment",
      "James Cameron",
      ["Zoe Saldana", "Sam Worthington", "Michelle Rodriguez"],
      "12/18/2009",
      "2h 41min"
    );

    //  6. Log the newly created 3rd movie. (Just that movie, not all movies)
    console.log(MovieThird);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   7. Rename the first movie
    const UpdateFirst = await movies.renameMovie(
      MovieOne._id.toString(),
      "Slumdog Millionaire part 2"
    );
    //   8. Log the first movie with the updated name.
    console.log(UpdateFirst);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   9. Remove the second movie you created.
    const removeMovieTwo = await movies.removeMovie(MovieTwo._id.toString());
    console.log(removeMovieTwo);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   10. Query all movies, and log them all
    const allMovies = await movies.getAllMovies();
    console.log(allMovies);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");

  //Movies method fails
  try {
    //   11. Try to create a movie with bad input parameters to make sure it throws errors.
    FailMovieOne = await movies.createMovie(
      "a    ",
      "Hackers are blamed for making a virus that will capsize five oil tankers.",
      ["Crime", "Drama", "Romance"],
      "NC-17",
      "United Artists",
      "Iain Softley",
      ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"],
      "09/15/1995",
      "1h 45min"
    );
    console.log(FailMovieOne);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   12. Try to remove a movie that does not exist to make sure it throws errors.
    const FailremoveMovie = await movies.removeMovie(
      "507f1f77bcf86cd799439012"
    );
    console.log(FailremoveMovie);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   13. Try to rename a movie that does not exist to make sure it throws errors.
    const FailUpdate = await movies.renameMovie(
      "507f1f77bcf86cd799439012",
      "Superman"
    );
    console.log(FailUpdate);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   14. Try to rename a movie that does not exist to make sure it throws errors.
    const FailUpdate2 = await movies.renameMovie(
      "507f1f77bcf86cd799439014",
      " Hello@#"
    );
    console.log(FailUpdate2);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  try {
    //   15. Try getting a movie by ID that does not exist to make sure it throws errors.
    const FailGetMovie = await movies.getMovieById("507f1f77bcf86cd799439010");
    console.log(FailGetMovie);
  } catch (e) {
    console.log(e);
  }
  console.log("\n");
  await connection.closeConnection();
};
main();
