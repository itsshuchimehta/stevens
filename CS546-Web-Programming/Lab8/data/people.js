const axios = require("axios");
//validations
function InputCheck(field, varName) {
  if (field === undefined) {
    throw `Error 400 : Please provid valid ${varName} !`;
  }
  if (field.length === 0) {
    throw `Error 400 : ${varName} must not be Empty!`;
  }
  if (field.replace(/\s+/g, "").length === 0) {
    throw `Error 400 : Please provid valid ${varName}, Empty Spaces can not considered as valid input !`;
  }
}

//Axios call to get all data
const getAllPeople = async () => {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json"
  );
  return data;
};

//Function to list of up to 20 people matching the searchPersonName (sorted by id)
const searchPeopleByName = async (searchPersonName) => {
  InputCheck(searchPersonName, "name");

  let PeopleInfo = await getAllPeople();

  let result = [];
  if (PeopleInfo.length > 0) {
    PeopleInfo.sort(function (a, b) {
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });

    for (let i = 0; i < PeopleInfo.length; i++) {
      let fullname =
        PeopleInfo[i].firstName.toUpperCase() +
        " " +
        PeopleInfo[i].lastName.toUpperCase();

      if (fullname.includes(searchPersonName.toUpperCase())) {
        result.push(PeopleInfo[i]);
      }
      if (result.length === 20) {
        break;
      }
    }
  }
  return result;
};

//Function to list person matching the id
const searchPeopleByID = async (id) => {
  InputCheck(id, "id");

  let PeopleInfo = await getAllPeople();
  let result = 0;
  if (PeopleInfo.length > 0) {
    PeopleInfo.forEach((data) => {
      if (data.id === parseInt(id)) {
        result = data;
      }
    });
  }
  return result;
};

module.exports = { searchPeopleByName, searchPeopleByID };
