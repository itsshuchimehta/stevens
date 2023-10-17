const mongoCollections = require("../config/mongoCollections");
const user_collection = mongoCollections.user_collection;
const { ObjectId } = require("mongodb");
const validation = require("../helpers");

const bcrypt = require("bcrypt");
const saltRounds = 16;

const createUser = async (username, password) => {
  validation.CheckUsername(username);
  validation.CheckPassword(password);

  let insertStatus = {};
  username = username.toLowerCase();
  const userCollection = await user_collection();
  const FoundUser = await userCollection.findOne({
    username: username,
  });

  if (FoundUser !== null) {
    throw "Username Already Exist! try other Username";
  }

  const hashPassword = await bcrypt.hash(password, saltRounds);

  let new_user = {
    username: username,
    password: hashPassword,
  };
  const insertInfo = await userCollection.insertOne(new_user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not insert";

  insertStatus.insertedUser = true;

  return insertStatus;
};

const checkUser = async (username, password) => {
  validation.CheckUsername(username);
  validation.CheckPassword(password);
  let result;
  username = username.toLowerCase();

  const userCollection = await user_collection();

  const FoundUser = await userCollection.findOne({
    username: username,
  });
  if (FoundUser === null) throw "No User found!";

  let compareToSherlock = false;
  compareToSherlock = await bcrypt.compare(password, FoundUser.password);

  if (compareToSherlock === false) throw "Wrong Password! Try Again!";

  result = { authenticatedUser: true };
  return result;
};

module.exports = { createUser, checkUser };
