let CheckUsername = (val) => {
  if (!val) throw "Username Must be supplied";
  if (val === undefined) throw "Username must exist!";
  if (typeof val !== "string") throw "Username must be of string type!";
  if (val.length === 0) throw "Username must not be Empty!";
  if (val.trim().length === 0)
    throw "Username cannot be an empty string or just spaces!";
  if (/\s/.test(val) === true) throw "Username Must not Contain spaces!";
  if (val.trim().length < 4)
    throw "Username must be at least 4 characters long";

  const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
  for (let i = 0; i < val.length; i++) {
    //Check for Special Characters
    specialChars.split("").some((specialChar) => {
      if (val[i].includes(specialChar))
        throw "Username can only contain alphanumeric characters";
    });
  }
};

let CheckPassword = (val) => {
  if (!val) throw "Password Must be supplied";
  if (val === undefined) throw "Password must exist!";
  if (typeof val !== "string") throw "Password must be of string type!";
  if (val.length === 0) throw "Password must not be Empty!";
  if (val.trim().length === 0)
    throw "Password cannot be an empty string or just spaces!";
  if (/\s/.test(val) === true) throw "Password Must not Contain spaces!";
  if (val.trim().length < 6)
    throw "Password must be at least 6 characters long";

  const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let cnt_Spec = 0;
  let cnt_num = 0;
  let cnt_upper = 0;
  for (let i = 0; i < val.length; i++) {
    if (/^[A-Z]*$/.test(val[i])) cnt_upper++;
    specialChars.split("").some((specialChar) => {
      if (val[i].includes(specialChar)) cnt_Spec++;
    });
    numbers.some((num) => {
      if (val[i].includes(num)) cnt_num++;
    });
  }
  if (cnt_upper === 0)
    throw "Password must contain at least one uppercase character";
  if (cnt_Spec === 0)
    throw "Password must contain at least one special character";
  if (cnt_num === 0) throw "Password must contain at least one numeric value";
};

module.exports = {
  CheckUsername,
  CheckPassword,
};
