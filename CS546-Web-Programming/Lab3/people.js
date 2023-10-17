const axios = require("axios");
async function getPeople() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json"
  );
  return data;
}

function InputCheck(field, varName) {
  if (field === undefined) {
    throw `${varName} must exist!`;
  }
  if (typeof field !== "string") {
    throw `${varName} must be of string type!`;
  }
  if (field.length === 0) {
    throw `${varName} must not be Empty!`;
  }
  if (field.replace(/\s+/g, "").length === 0) {
    throw `Empty Spaces can not considered as ${varName} !`;
  }
}

const getPersonById = async (id) => {
  InputCheck(id, Object.keys({ id })[0]);
  let PeopleInfo = await getPeople();
  let result = 0;
  if (PeopleInfo.length > 0) {
    PeopleInfo.forEach((data) => {
      if (data.id === id) {
        result = data;
      }
    });
    if (result === 0) {
      throw "Person not found!";
    }
  }
  return result;
};

const sameJobTitle = async (jobTitle) => {
  InputCheck(jobTitle, Object.keys({ jobTitle })[0]);
  let PeopleInfo = await getPeople();
  let result = [];
  if (PeopleInfo.length > 0) {
    PeopleInfo.forEach((data) => {
      if (data.job_title.toUpperCase() === jobTitle.toUpperCase()) {
        result.push(data);
      }
    });
    if (result.length < 2) {
      throw `There are less than two people with the job title as ${jobTitle}`;
    }
  }
  return result;
};

const getPostalCodes = async (city, state) => {
  if (city === undefined && state === undefined) {
    throw "city and state both must exist!";
  }
  if (typeof city !== "string" && typeof state !== "string") {
    throw "city and state both must be of string type!";
  }
  if (city.length === 0 && state.length === 0) {
    throw "city and state both must not be Empty!";
  }
  if (
    city.replace(/\s+/g, "").length === 0 &&
    state.replace(/\s+/g, "").length === 0
  ) {
    throw "Empty Spaces can not considered for city and state !";
  }
  InputCheck(city, Object.keys({ city })[0]);
  InputCheck(state, Object.keys({ state })[0]);
  let PeopleInfo = await getPeople();
  let result = [];
  let finalresult = [];
  if (PeopleInfo.length > 0) {
    PeopleInfo.forEach((data) => {
      if (data.state.toUpperCase() === state.toUpperCase()) {
        if (data.city.toUpperCase() === city.toUpperCase()) {
          result.push(parseInt(data.postal_code));
        }
      }
    });
    if (result.length === 0) {
      throw `There are no postal_codes for the given city and state combination : ${city}, ${state}`;
    }

    result.sort(function (a, b) {
      return a - b;
    });
  }
  return result;
};

const sameCityAndState = async (city, state) => {
  if (city === undefined && state === undefined) {
    throw "city and state both must exist!";
  }
  if (typeof city !== "string" && typeof state !== "string") {
    throw "city and state both must be of string type!";
  }
  if (city.length === 0 && state.length === 0) {
    throw "city and state both must not be Empty!";
  }
  if (
    city.replace(/\s+/g, "").length === 0 &&
    state.replace(/\s+/g, "").length === 0
  ) {
    throw "Empty Spaces can not considered for city and state !";
  }
  InputCheck(city, Object.keys({ city })[0]);
  InputCheck(state, Object.keys({ state })[0]);
  let PeopleInfo = await getPeople();
  let result = [];
  let finalresult = [];
  if (PeopleInfo.length > 0) {
    PeopleInfo.sort(function (a, b) {
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }
      return 0;
    });
    PeopleInfo.forEach((data) => {
      if (data.state.toUpperCase() === state.toUpperCase()) {
        if (data.city.toUpperCase() === city.toUpperCase()) {
          result.push(data.first_name + " " + data.last_name);
        }
      }
    });

    if (result.length < 2) {
      throw `There are less than two people who live in the same city and state as ${city}, ${state}`;
    }
  }
  return result;
};

module.exports = {
  getPersonById,
  sameJobTitle,
  getPostalCodes,
  sameCityAndState,
};
