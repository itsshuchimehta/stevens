const { ObjectId } = require("mongodb");

let checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

let CheckString = (field, varName) => {
  if (field === undefined) {
    throw `${varName} must exist!`;
  }
  if (typeof field !== "string") {
    throw `${varName} must be of string type!`;
  }
  if (field.length === 0) {
    throw `${varName} must not be Empty!`;
  }
  if (field.trim().length === 0) {
    throw `${varName} cannot be an empty string or just spaces!`;
  }
};

let CheckFormat = (field, varName, CanBeNum, MinLength) => {
  if (field.trim().length < MinLength)
    throw `${varName} must be at least ${MinLength} characters`;

  const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  for (let i = 0; i < field.length; i++) {
    //Check for Special Characters
    specialChars.split("").some((specialChar) => {
      if (field[i].includes(specialChar))
        throw `${varName} must not contain any special characters or punctuation`;
    });
    if (CanBeNum === false) {
      //Check for Numbers
      numbers.some((num) => {
        if (field[i].includes(num))
          throw `${varName} must not contain any number`;
      });
    }
  }
};
let CheckArrareEqual = (array1, array2) => {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element) === false) {
        return false;
      }
      return true;
    });
  }
  return false;
};

module.exports = {
  checkId,
  CheckString,
  CheckFormat,
  CheckArrareEqual,
};
