const { ObjectId } = require("mongodb");
let CheckID = (id) => {
  if (!id) throw "ID must be supplied";
  if (typeof id !== "string") throw "ID must be a string";
  if (id.trim().length === 0)
    throw "ID cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "ID is not a valid object ID";
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

module.exports = {
  CheckID,
  CheckString,
  CheckFormat,
};
