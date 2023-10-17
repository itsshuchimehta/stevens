// Error Check methods
function CheckObjectProper(obj) {
  if (Array.isArray(obj) === true) {
    throw "OBJECT IS NOT OF THE PROPER TYPE!";
  }
  if (typeof obj !== "object") {
    throw "OBJECT IS NOT OF THE PROPER TYPE!";
  }
}

let myResultArr = [];
//Helper Method
function HelperObject(ob1, ob2) {
  let result = false;
  let obj1Keys = Object.keys(ob1);
  let obj2Keys = Object.keys(ob2);
  let obj2Vals = Object.values(ob2);
  for (let m = 0; m < obj2Keys.length; m++) {
    if (obj1Keys.includes(obj2Keys[m]) == true) {
      let matchval = ob1[obj2Keys[m]];
      if (typeof matchval === "object" && Array.isArray(matchval) === false) {
        if (typeof obj2Vals[m] === "object") {
          if (
            Object.keys(matchval).length === Object.keys(obj2Vals[m]).length
          ) {
            result = HelperObject(obj2Vals[m], matchval);
          } else {
            myResultArr.push(false);
          }
        }
      } else if (Array.isArray(matchval) === true) {
        if (Array.isArray(obj2Vals[m]) === true) {
          if (matchval.length === obj2Vals[m].length) {
            let matchArr = obj2Vals[m];
            for (let i = 0; i < matchval.length; i++) {
              if (matchval[i] === matchArr[i]) {
                result = true;
              } else {
                myResultArr.push(false);
                break;
              }
            }
          } else {
            result = false;
            myResultArr.push(false);
          }
        } else {
          result = false;
          myResultArr.push(false);
        }
      } else {
        if (matchval === obj2Vals[m]) {
          result = true;
        } else {
          result = false;
          myResultArr.push(false);
          break;
        }
      }
    }
  }

  return result;
}
/* deepEquality : This method checks each field (at every level deep) in obj1 and obj2 for equality.
 * It will return true if each field is equal, and false if not. Note: Empty objects can be passed into this function.
 */
let deepEquality = (obj1, obj2) => {
  if (obj1 === undefined || obj2 === undefined) {
    throw "BOTH OBJECTS MUST EXIST!";
  }
  CheckObjectProper(obj1);
  CheckObjectProper(obj2);

  let ans = true;
  let objKeys1 = Object.keys(obj1);
  let objKeys2 = Object.keys(obj2);
  let objvalues1 = Object.values(obj1);

  let obj1Keys = Object.keys(obj1);
  let obj2Keys = Object.keys(obj2);
  let obj2Vals = Object.values(obj2);

  if (Object.keys(obj1).length === 0 && Object.keys(obj2).length === 0) {
    ans = true;
  } else if (Object.keys(obj1).length === Object.keys(obj2).length) {
    let cnt = 0;
    objKeys1.forEach((keys) => {
      if (objKeys2.includes(keys) == true) {
        cnt++;
      }
    });

    if (cnt == objKeys1.length) {
      HelperObject(obj1, obj2);
    } else {
      ans = false;
    }
  } else {
    ans = false;
  }
  if (myResultArr.length > 0) {
    ans = false;
  }

  return ans;
};

//Helper Method
function HelperCommonObject(ob1, ob2) {
  let result = false;
  let obj1Keys = Object.keys(ob1);
  let obj2Keys = Object.keys(ob2);
  let obj2Vals = Object.values(ob2);
  for (let m = 0; m < obj2Keys.length; m++) {
    if (obj1Keys.includes(obj2Keys[m]) == true) {
      let matchval = ob1[obj2Keys[m]];
      if (typeof matchval === "object" && Array.isArray(matchval) === false) {
        if (typeof obj2Vals[m] === "object") {
          if (
            Object.keys(matchval).length === Object.keys(obj2Vals[m]).length
          ) {
            result = HelperObject(obj2Vals[m], matchval);
          } else {
          }
        }
      } else if (Array.isArray(matchval) === true) {
        if (Array.isArray(obj2Vals[m]) === true) {
          if (matchval.length === obj2Vals[m].length) {
            let matchArr = obj2Vals[m];
            for (let i = 0; i < matchval.length; i++) {
              if (matchval[i] === matchArr[i]) {
                result = true;
              } else {
                result = false;
                break;
              }
            }
          } else {
            result = false;
          }
        } else {
          result = false;
        }
      } else {
        if (matchval === obj2Vals[m]) {
          result = true;
        } else {
          result = false;

          break;
        }
      }
    }
  }

  return result;
}
/* commonKeysValues : This method checks each field (at every level deep) in obj1 and obj2
 * for and finds the common key/value pairs that appear in both obj1 and obj2.
 */
let commonKeysValues = (obj1, obj2) => {
  //Error Check
  if (obj1 === undefined || obj2 === undefined) {
    throw "BOTH OBJECTS MUST EXIST!";
  }
  CheckObjectProper(obj1);
  CheckObjectProper(obj2);

  let resultObj = {};
  let myArrV = [];
  let myArrK = [];
  let ans;
  let objKeys1 = Object.keys(obj1);
  let objKeys2 = Object.keys(obj2);
  let objvalues1 = Object.values(obj1);

  if (Object.keys(obj1).length === 0 && Object.keys(obj2).length === 0) {
    resultObj = {};
  } else {
    for (let k = 0; k < objKeys1.length; k++) {
      if (objKeys2.includes(objKeys1[k]) == true) {
        let valobj2 = obj2[objKeys1[k]];
        if (typeof valobj2 === "object") {
          if (typeof objvalues1[k] === "object") {
            ans = HelperCommonObject(objvalues1[k], valobj2); // If key has a object as value Call Helper Function (Recursion) May happen
            if (ans == true) {
              resultObj[objKeys1[k]] = objvalues1[k];
              if (typeof objvalues1[k] === "object") {
                myArrV = Object.values(objvalues1[k]);
                myArrK = Object.keys(objvalues1[k]);
                for (let a = 0; a < myArrK.length; a++) {
                  resultObj[myArrK[a]] = myArrV[a];
                }
              }
              resultObj[objKeys1[k]] = objvalues1[k];
            }
          }
        } else {
          if (valobj2 == objvalues1[k]) {
            if (ans == true) {
              resultObj[objKeys1[k]] = valobj2;
            }
          }
        }
      }
    }
  }
  return resultObj;
};

/* calculateObject : Given an object and a function, evaluate the function on the values of the object
 * and then calculate the square root after evaluatation of the function
 * and return a new object with the results.
 */
let calculateObject = (object, func) => {
  //Error Check
  if (object === undefined) {
    throw "OBJECT DOES NOT EXIST!";
  }
  if (Object.keys(object).length === 0) {
    throw "OBJECT MUST NOT BE EMPTY!";
  }
  if (func === undefined) {
    throw "FUNCTION DOES NOT EXIST!";
  }
  if (typeof func != "function") {
    throw "FUNCTION SHOULD BE OF PROPER TYPE!";
  }
  CheckObjectProper(object);

  resultObj = {};
  let objKeys = Object.keys(object);
  let objvalues = Object.values(object);
  for (let i = 0; i < objKeys.length; i++) {
    if (typeof objvalues[i] === "number") {
      if (Math.sqrt(func(objvalues[i])).toFixed(2) == "NaN") {
        resultObj[objKeys[i]] = NaN;
      } else {
        resultObj[objKeys[i]] = Math.sqrt(func(objvalues[i])).toFixed(2);
      }
    } else {
      throw "OBJECT KEYs MUST HAVE NUMERIC VALUES (positive, negative, decimal)!";
    }
  }
  return resultObj;
};

module.exports = {
  deepEquality,
  commonKeysValues,
  calculateObject,
};
