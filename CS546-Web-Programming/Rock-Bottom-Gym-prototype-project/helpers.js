const moment = require("moment");
const { ObjectId } = require("mongodb");
//*************************Validating Object ID Start ***************************************/

const checkObjectId = (field) => {
  //Check  if the ID is not Empty
  if (!field) throw { code: 400, message: `Please pass ID in the parameter` };

  //Check if the ID is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `ID should be a string`,
    };
  }

  //Check if the ID does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the ID`,
    };

  field = field.trim();

  if (!ObjectId.isValid(field))
    throw { code: 400, message: `Invalid object ID` };

  return field;
};

//******************************** Validating Object ID END */

/**************************User Valiation Start **************************************/

//Validating FirstName
const checkFirstName = (field) => {
  //Check  if the firstName is not Empty
  if (!field)
    throw { code: 400, message: `Please pass firstName in the parameter` };

  //Check if the firstName is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `FirstName should be a string`,
    };
  }

  //Check if the firstName does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the firstName`,
    };

  field = field.trim();

  //Check if the firstName does not contain numbers or special characters and  firstName is not less than 2 characters
  let regex = /[^a-zA-Z]/;
  if (regex.test(field) || field.length < 1)
    throw {
      code: 400,
      message: `firstName should be atleast 2 characters long and should contain only contain letters a-z, A-Z`,
    };

  return field;
};

//Validating LastName
const checkLastName = (field) => {
  //Check  if the lastName is not Empty
  if (!field)
    throw { code: 400, message: `Please pass lastName in the parameter` };

  //Check if the lastName is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `lastName should be a string`,
    };
  }

  //Check if the lastName does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the lastName`,
    };

  field = field.trim();

  //Check if the lastName does not contain numbers or special characters and  lastName is not less than 2 characters
  let regex = /[^a-zA-Z]/;
  if (regex.test(field) || field.length < 1)
    throw {
      code: 400,
      message: `lastName should be atleast 2 characters long and should contain only contain letters a-z, A-Z`,
    };

  return field;
};

//Validating Gender
const checkGender = (field) => {
  //Check if the Gender is notEmpty
  if (!field)
    throw { code: 400, message: `Please pass Gender in the parameter` };

  //Check if the Gender is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Gender should be a string`,
    };
  }

  //Check if the Gender does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Gender`,
    };

  field = field.trim();

  //   //Check if the Gender does not contain numbers or special characters and  lastName is not less than 2 characters
  //   let regex = /[^a-zA-Z]/;
  //   if (regex.test(field) || field.length < 2)
  //     throw {
  //       code: 400,
  //       message: `Gender should be atleast 2 characters long and should contain only contain letters a-z, A-Z`,
  //     };

  return field;
};

//Validating Date of birth
const checkDob = (field) => {
  //Check if the Date of Birth is not Empty
  if (!field)
    throw { code: 400, message: `Please pass Date of birth in the parameter` };

  //Check if the Date of Birth is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Date of Birth should be a string`,
    };
  }

  //Check if the Date of Birth does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Date of Birth`,
    };

  field = field.trim();

  //Suppressing the warning of momentjs
  moment.suppressDeprecationWarnings = true;

  //Checking if the date is in the format MM-DD-YYYYY
  let result = new moment(field, "YYYY-MM-DD").format("MM-DD-YYYY");
  result = moment(result, "MM-DD-YYYY").isValid();
  if (!result)
    throw {
      code: 400,
      message: `Date is not valid please use MM-DD-YYYY format`,
    };
  return field;
};

//Validating ADDRESS
const checkAddress = (field) => {
  //Check if the Address is not Empty
  if (!field)
    throw { code: 400, message: `Please pass address in the parameter` };

  //Check if the Address is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Address should be a string`,
    };
  }

  //Check if the Address does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Address`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Address should be atleast 2 characters long`,
    };

  return field;
};

//Validating zipCode
const checkZipCode = (field) => {
  //Check if the Zipcode is not Empty
  if (!field)
    throw { code: 400, message: `Please pass Zipcode in the parameter` };

  //Check if the Zipcode is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Zipcode should be a string`,
    };
  }

  //Check if the Zipcode does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Zipcode`,
    };

  field = field.trim();

  //   //Checking if the zipcode does not contain special characters and alphabets. Also it should be of five length
  //   let regex = /[^0-9]/;
  //   if (regex.test(field) || field.length !== 5)
  //     throw {
  //       code: 400,
  //       message: `Zipcode should be numeric and should be of length 5`,
  //     };

  //   //Converting the field to integer
  //   let temp = parseInt(field);

  //   if (temp < 1 || temp > 99950)
  //     throw {
  //       code: 400,
  //       message: `Zipcode should be between 1 and 99950 both inclusive`,
  //     };

  return field;
};

//Validating MobileNumber
const checkNumber = (field) => {
  //Check if the ContactNumber is not Empty
  if (!field)
    throw { code: 400, message: `Please pass ContactNumber in the parameter` };

  //Check if the ContactNumber is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `ContactNumber should be a string`,
    };
  }

  //Check if the ContactNumber does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the ContactNumber`,
    };

  field = field.trim();

  //Checking if the ContactNumber does not contain special characters and alphabets. Also it should be of ten length
  let regex = /[^0-9]/;
  if (regex.test(field) || field.length !== 10)
    throw {
      code: 400,
      message: `ContactNumber should be numeric and should be of length 10`,
    };

  return field;
};

//Validating EmailId
const checkEmail = (field) => {
  //Check if the EmailId is not Empty
  if (!field)
    throw { code: 400, message: `Please pass EmailId in the parameter` };

  //Check if the EmailId is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `EmailId should be a string`,
    };
  }

  //Check if the EmailId does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the EmailId`,
    };

  field = field.trim();

  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(field)) {
    throw {
      code: 400,
      message: `Please Pass valid email address`,
    };
  }

  return field;
};

//Validating Password. We are allowing the user to store space in the databaes
const checkPassword = (field) => {
  //Check if the Password is not Empty
  if (!field)
    throw { code: 400, message: `Please pass Password in the parameter` };

  //Check if the Password is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Password should be a string`,
    };
  }

  //Check if the Password does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Password`,
    };

  //Code for password
  return field;
};

/****************************  User Valiation END    **************************************/

/***************************** User Group Validation Start **************************************/

//Validating UserGroup Name
const checkUserGroupName = (field) => {
  //Check if the UserCategoryName is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass UserCategoryName in the parameter`,
    };

  //Check if the UserCategoryName is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `UserCategoryName should be a string`,
    };
  }

  //Check if the UserCategoryName does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the UserCategoryName`,
    };

  field = field.trim();

  //Check if the UserCategoryName does not contain numbers or special characters and UserCategoryName is not less than 2 characters
  let regex = /[^a-zA-Z]/;
  if (regex.test(field) || field.length < 2)
    throw {
      code: 400,
      message: `UserCategoryName should be atleast 2 characters long and should contain only contain letters a-z, A-Z`,
    };
  return field;
};

//Validating UserGroupDescription

const checkUserGroupDescription = (field) => {
  //Check if the UserCategoryDescription is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass UserCategoryDescription in the parameter`,
    };

  //Check if the UserCategoryDescription is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `UserCategoryDescription should be a string`,
    };
  }

  //Check if the UserCategoryDescription does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the UserCategoryDescription`,
    };

  field = field.trim();

  //Check if the UserCategoryDescription does not contain numbers or special characters and UserCategoryDescription is not less than 2 characters
  let regex = /[^a-zA-Z0-9\s]/;
  if (regex.test(field) || field.length < 2)
    throw {
      code: 400,
      message: `UserCategoryDescription should be atleast 2 characters long and should be alphanumeric`,
    };
  return field;
};
/****************************  User Group Validation END  **************************************/

/***************************** Product  VAlidation Start ******************************************/

//Validating productName
const checkProductName = (field) => {
  //Check if the productName is not Empty
  if (!field)
    throw { code: 400, message: `Please pass productName in the parameter` };

  //Check if the productName is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `productName should be a string`,
    };
  }

  //Check if the UserCategoryDescription does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the productName`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `productName should be atleast 2 characters long`,
    };

  return field;
};

//Validating productDescription
const checkProductDescription = (field) => {
  //Check if the productDescription is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass productDescription in the parameter`,
    };

  //Check if the productDescription is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `productDescription should be a string`,
    };
  }

  //Check if the productDescription does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the productDescription`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `productDescription should be atleast 2 characters long`,
    };

  return field;
};

//Validating price
const checkProductPrice = (field) => {
  //Check if the productPrice is not Empty
  if (!field)
    throw { code: 400, message: `Please pass productPrice in the parameter` };

  //Check if the productPrice is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `productPrice should be a string`,
    };
  }

  //Check if the productDescription does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the productPrice`,
    };

  field = field.trim();

  let regex = /^\d{0,8}(\.\d{1,4})?$/;

  if (!regex.test(field))
    throw {
      code: 400,
      message: `Please enter the price in the correct format`,
    };

  return field;
};

//Validating Category
const checkProductCategory = (field) => {
  //Check if the Category is not Empty
  if (!field)
    throw { code: 400, message: `Please pass Category in the parameter` };

  //Check if the Category is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Category should be a string`,
    };
  }

  //Check if the Category does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Category`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Category should be atleast 2 characters long`,
    };

  return field;
};

//Validating Product Image
const checkProductImage = (field) => {
  //Check if the Product Image is not Empty
  if (!field)
    throw { code: 400, message: `Please pass Product Image in the parameter` };

  //Check if the Product Image is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Product Image should be a string`,
    };
  }

  //Check if the Product Image does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Product Image`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Product Image should be atleast 2 characters long`,
    };

  return field;
};

/***************************** Product Validation END ******************************************/

/****************************** BLOG Validation Start *******************************************/

//Validating blog Name
const checkBlogName = (field) => {
  //Check if the blog Name is not Empty
  if (!field)
    throw { code: 400, message: `Please pass blog Name in the parameter` };

  //Check if the blog Name is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Blog Name should be a string`,
    };
  }

  //Check if the Blog Name does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Blog Name`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Blog Name should be atleast 2 characters long`,
    };

  return field;
};

//Validating blog Description
const checkBlogDescription = (field) => {
  //Check if the blog Description is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass blog Description in the parameter`,
    };

  //Check if the blog Description is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `blog Description should be a string`,
    };
  }

  //Check if the blog Description does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the blog Description`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `blog Description should be atleast 2 characters long`,
    };

  return field;
};

/*****************************  BLOG Validation END **************************************************** */

/*****************************  Subscription Validation Start **************************************************** */

//Validating Subscription Name
const checkSubscriptionName = (field) => {
  //Check if the Subscription Name is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass Subscription Name in the parameter`,
    };

  //Check if the Subscription Name is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Subscription Name should be a string`,
    };
  }

  //Check if the Subscription Name does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Subscription Name`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Subscription Name should be atleast 2 characters long`,
    };

  return field;
};

//Validating Subscription Description
const checkSubscriptionDescription = (field) => {
  //Check if the Subscription Description is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass Subscription Description in the parameter`,
    };

  //Check if the Subscription Description is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `SSubscription Description should be a string`,
    };
  }

  //Check if the Subscription Description does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Subscription Description`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Subscription Description should be atleast 2 characters long`,
    };

  return field;
};

//Validating Subscription Amount
const checkSubscriptionAmount = (field) => {
  //Check if the Subscription Amountn is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass Subscription Amount in the parameter`,
    };

  //Check if the Subscription Amount is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Subscription Amount should be a string`,
    };
  }

  //Check if the Subscription Amount does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Subscription Amount`,
    };

  field = field.trim();

  let regex = /^\d{0,8}(\.\d{1,4})?$/;

  if (!regex.test(field))
    throw {
      code: 400,
      message: `Please enter the Subscription Amount in the correct format`,
    };
  return field;
};

//Check Subscription Duration
const checkSubscriptionDuration = (field) => {
  //Check if the Subscription Duration is not Empty
  if (!field)
    throw {
      code: 400,
      message: `Please pass Subscription Duration in the parameter`,
    };

  //Check if the Subscription Duration is a string
  if (typeof field !== `string`) {
    throw {
      code: 400,
      message: `Subscription Duration should be a string`,
    };
  }

  //Check if the Subscription Duration does not contain only spaces
  if (field.trim().length === 0)
    throw {
      code: 400,
      message: `Dont pass only leading or trailing zeros in the Subscription Duration`,
    };

  field = field.trim();

  if (field.length < 2)
    throw {
      code: 400,
      message: `Subscription Duration should be atleast 2 characters long`,
    };
  return field;
};

/*****************************  Subscription Validation END **************************************************** */

module.exports = {
  checkObjectId,
  checkFirstName,
  checkLastName,
  checkGender,
  checkDob,
  checkAddress,
  checkZipCode,
  checkNumber,
  checkEmail,
  checkPassword,
  checkUserGroupName,
  checkUserGroupDescription,
  checkProductName,
  checkProductDescription,
  checkProductPrice,
  checkProductCategory,
  checkProductImage,
  checkBlogName,
  checkBlogDescription,
  checkSubscriptionName,
  checkSubscriptionDescription,
  checkSubscriptionAmount,
  checkSubscriptionDuration,
};
