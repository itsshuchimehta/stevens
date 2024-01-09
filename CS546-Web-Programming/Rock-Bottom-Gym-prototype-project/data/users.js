const mongoCollections = require("../config/mongoCollections");
const user = mongoCollections.user;
const userGroup = mongoCollections.user_group;
const { ObjectId } = require("mongodb");
let moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const helper = require("../helpers");

//Create a UserGroup for User and Admin
const createUserGroup = async (name, description) => {
  //Code to check all the parameters
  name = helper.checkUserGroupName(name);
  description = helper.checkUserGroupDescription(description);

  //Getting the userGroupCOllection
  const userGroupCollection = await userGroup();

  let newUserGroup = {
    name: name,
    description: description,
    status: true,
  };
  const insertInfo = await userGroupCollection.insertOne(newUserGroup);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw {
      code: 500,
      message: `Could not insert the user group at this time`,
    };
  }

  //Return the inserted User
  const newUser = await getUserGroupById(insertInfo.insertedId.toString());

  return newUser;
};

//Get the user group by id
const getUserGroupById = async (id) => {
  //Validate the id
  id = helper.checkObjectId(id);

  const userGroupCollection = await userGroup();

  const findUserGroup = await userGroupCollection.findOne({
    _id: ObjectId(id),
  });

  if (!findUserGroup)
    throw {
      code: 404,
      message: `User Group not found`,
    };

  findUserGroup._id = findUserGroup._id.toString();
  return findUserGroup;
};

//Get the user group by id
const getUserGroupByName = async (name) => {
  //Validate the id
  name = helper.checkUserGroupName(name);

  const userGroupCollection = await userGroup();

  let regex = `^${name}$`;

  name = new RegExp(regex, "i");

  const findUserGroupByName = await userGroupCollection.findOne({ name: name });

  if (!findUserGroupByName)
    throw {
      code: 404,
      message: `User Group Name not found`,
    };

  findUserGroupByName._id = findUserGroupByName._id.toString();
  return findUserGroupByName;
};

//Register User
const createUser = async (
  firstname,
  lastname,
  gender,
  dob,
  address,
  zipcode,
  cell,
  email,
  password,
  user_group_id
) => {
  //Code to check All the parameters
  firstname = helper.checkFirstName(firstname);
  lastname = helper.checkLastName(lastname);
  gender = helper.checkGender(gender);
  dob = helper.checkDob(dob);
  address = helper.checkAddress(address);
  zipcode = helper.checkZipCode(zipcode);
  cell = helper.checkNumber(cell);
  email = helper.checkEmail(email);
  password = helper.checkPassword(password);
  user_group_id = helper.checkObjectId(user_group_id);

  //Code to insert the data in the database
  let insertStatus = {};
  email = email.toLowerCase();
  const userCollection = await user();
  const FoundUser = await userCollection.findOne({
    email: email,
  });

  if (FoundUser)
    throw {
      code: 400,
      message: "Username Already Exist!",
    };

  dob = new moment(dob).format("MM-DD-YYYY");

  const hashPassword = await bcrypt.hash(password, saltRounds);

  let new_user = {
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    dob: dob,
    address: address,
    zipcode: zipcode,
    cell: cell,
    email: email,
    password: hashPassword,
    profile_image: "",
    status: true,
    user_group_id: user_group_id,
  };
  const insertInfo = await userCollection.insertOne(new_user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw { code: 500, message: "Could not insert" };
  }

  const insertedUser = await getUserById(insertInfo.insertedId.toString());
  insertedUser.insertedUser = true;
  insertedUser._id = insertedUser._id.toString();

  return insertedUser;
};

//Get user by id
const getUserById = async (id) => {
  //Validate the id
  id = helper.checkObjectId(id);

  const userCollection = await user();

  const findUser = await userCollection.findOne({ _id: ObjectId(id) });

  if (!findUser)
    throw {
      code: 404,
      message: `User  not found`,
    };

  findUser._id = findUser._id.toString();
  return findUser;
};

//Get the User by Email Id
const getUserByEmail = async (emailID) => {
  //Code to check the parameters of the emailID
  emailID = helper.checkEmail(emailID);

  emailID = emailID.toLowerCase();

  //Retriving User collections  from the database
  const UserCollection = await user();

  //Retriving a User by Email Id
  const userbyemail = await UserCollection.findOne({
    email: emailID,
  });

  //Checing if the User is retrived from the database. If not throw an error
  if (userbyemail !== null) userbyemail._id = userbyemail._id.toString();

  // throw { code: 404, message: `User not found` };
  return userbyemail;
};

const getAllUsersByName = async () => {
  //Retriving User collections  from the database
  const UserCollection = await user();

  const getAllUsersByName = await UserCollection.find({})
    .project({ firstname: 1, lastname: 1 })
    .toArray();

  if (getAllUsersByName.length !== 0) {
    for (let i = 0; i < getAllUsersByName.length; i++) {
      getAllUsersByName[i]._id = getAllUsersByName[i]._id.toString();
    }
  }

  return getAllUsersByName;
};

const getUserNameWithComments = async (getProductById, getAllUsersName) => {
  let idNameMap = new Map();
  let result = [];

  //Stroring the userid as the key and firstname + lastName as the value;
  for (let i = 0; i < getAllUsersName.length; i++)
    idNameMap.set(
      getAllUsersName[i]._id,
      `${getAllUsersName[i].firstname} ${getAllUsersName[i].lastname}`
    );

  //Extracting the Array of Comment objects from the getProductById variable
  let commentObject = getProductById.comments;

  //Converting the converting the comment Object User id to String
  for (let i = 0; i < commentObject.length; i++) {
    commentObject[i].user_id = commentObject[i].user_id.toString();
  }

  for (let i = 0; i < commentObject.length; i++) {
    let userName = idNameMap.get(commentObject[i].user_id);
    let temp = {
      name: userName,
      comment: commentObject[i].comment,
      id: commentObject[i]._id.toString(),
    };

    result.push(temp);
  }
  return result;
};

const checkUser = async (email, password) => {
  helper.checkEmail(email);
  helper.checkPassword(password);
  let result;
  let isadmin = false;
  email = email.toLowerCase();

  const userCollection = await user();

  const FoundUser = await userCollection.findOne({
    email: email,
  });
  if (FoundUser === null) throw { code: 404, message: "No User found!" };

  let compareToSherlock = false;
  compareToSherlock = await bcrypt.compare(password, FoundUser.password);

  if (compareToSherlock === false)
    throw { code: 400, message: "Wrong Password! Try Again!" };

  let grouprole = await getUserGroupById(FoundUser.user_group_id);
  if (grouprole.name === "admin") {
    isadmin = true;
  }
  result = {
    authenticatedUser: true,
    user_id: FoundUser._id.toString(),
    name: FoundUser.firstname,
    groupid: FoundUser.user_group_id,
    role: isadmin,
  };

  return result;
};

const UpdateProfile = async (
  id,
  firstname,
  lastname,
  gender,
  dob,
  address,
  zipcode,
  cell,
  password,
  profile_image,
  changeinImage,
  changeinPassword
) => {
  //Code to check All the parameters
  id = helper.checkObjectId(id);
  firstname = helper.checkFirstName(firstname);
  lastname = helper.checkLastName(lastname);
  gender = helper.checkGender(gender);
  dob = helper.checkDob(dob);
  address = helper.checkAddress(address);
  zipcode = helper.checkZipCode(zipcode);
  cell = helper.checkNumber(cell);

  if (changeinPassword === true) {
    password = helper.checkPassword(password);
  }

  dob = new moment(dob).format("MM-DD-YYYY");

  const userCollection = await user();

  const SearchedUser = await userCollection.findOne({ _id: ObjectId(id) });

  if (SearchedUser === null) throw { code: 404, message: "User not found" };

  const updatedprofiledata = {
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    dob: dob,
    address: address,
    zipcode: zipcode,
    cell: cell,
  };
  if (changeinPassword === true) {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    updatedprofiledata.password = hashPassword;
  }

  if (changeinImage === true) {
    updatedprofiledata.profile_image = profile_image;
  }

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedprofiledata }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw { code: 500, message: "Could not insert" };
  }

  let result = await getUserById(id);
  result.UpdateData = true;

  return result;
};

module.exports = {
  UpdateProfile,
  createUserGroup,
  getUserById,
  getUserGroupById,
  getUserGroupByName,
  createUser,
  getUserByEmail,
  getAllUsersByName,
  getUserNameWithComments,
  checkUser,
};
