/* ERROR CHECK */
function CheckArrayExists(arr) {
  if (arr === undefined) {
    throw "ARRAY DOES NOT EXIST!";
  }
}
function CheckArrayProper(arr) {
  if (Array.isArray(arr) === false) {
    throw "ARRAY IS NOT OF THE PROPER TYPE!";
  }
}

function CheckArrayNotEmpty(arr) {
  if (arr.length === 0) {
    throw "ARRAY MUST NOT BE EMPTY!";
  }
}

function CheckArrayEl(arr) {
  let arrayCheck = arr.every((element) => {
    return typeof element === "number";
  });
  if (arrayCheck == false) {
    throw "EACH ARRAY ELEMENT MUST BE A NUMBER (EITHER POSITIVE, NEGATIVE, DECIMAL OR ZERO)!";
  }
}
/* arrayStats : This function will return an object with
 * the following stats of an array: mean, median, mode, range, minimum, maximum, count and sum.
 */
let arrayStats = (array) => {
  CheckArrayExists(array);
  CheckArrayProper(array);
  CheckArrayNotEmpty(array);
  CheckArrayEl(array);

  let ResultObj = {};
  //Array Sorting - Acending Order
  let values = array.sort(function (a, b) {
    return a - b;
  });
  //Array Count
  let cnt = array.length;
  //Sum
  let sum = 0;
  for (let i = 0; i < cnt; i++) {
    sum = sum + values[i];
  }
  //Mean
  let MeanVal = 0;
  if (sum > 0 && typeof sum == "number") {
    MeanVal = sum / cnt;
  }
  //Median
  let MedianVal = 0;
  let position = 0;
  if ((cnt + 1) % 2 == 0) {
    position = (cnt + 1) / 2;
    MedianVal = values[position - 1];
  } else {
    position = (cnt + 1) / 2;
    let pointers = position.toString();
    let positionA = parseInt(pointers[0]) - 1;
    let positionB = positionA + 1;
    let sumMedianPoints = (values[positionA] + values[positionB]) / 2;
    MedianVal = sumMedianPoints;
  }
  //Mode
  var modeVal = [];
  let m = 0;
  while (m < values.length) {
    if (values[m] == values[m + 1]) {
      modeVal.push(values[m]);
      m += 1;
    } else {
      m += 1;
    }
  }
  if (modeVal.length == 0) {
    modeVal = 0;
  } else if (modeVal.length == 1) {
    modeVal = modeVal[0];
  }
  //Range
  let RangeVal = 0;
  if (cnt > 0) {
    RangeVal = values[cnt - 1] - values[0];
  }
  //Object Keys
  ResultObj["mean"] = MeanVal;
  ResultObj["median"] = MedianVal;
  ResultObj["mode"] = modeVal;
  ResultObj["range"] = RangeVal;
  ResultObj["minimum"] = values[0];
  ResultObj["maximum"] = values[cnt - 1];
  ResultObj["count"] = cnt;
  ResultObj["sum"] = sum;
  return ResultObj;
};

/* makeObjects : For this function, Take in arrays as input.
 * Each array should have two and only two elements.
 * return an object that will have the first element of each array as the key and the second element of each array as the value.
 * If more than one of your arrays has the same first element, take the value from the last one that was passed in.
 */
let makeObjects = (...arrays) => {
  //this function takes in a variable number of arrays that's what the ...arrays signifies
  if (arrays.length > 0) {
    arrays.forEach((arr) => {
      CheckArrayExists(arr);
      CheckArrayProper(arr);
      CheckArrayNotEmpty(arr);
      if (arr.length > 2 || arr.length < 2) {
        throw "EACH ARRAY MUST HAVE TWO ELEMENTS ONLY!";
      }
    });
  } else {
    throw "ARRAY DOES NOT EXIST!";
  }

  let ResultObj = {};
  let keyArr = [];
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i][0] == "" || arrays[i][1] == "") {
      throw "ARRAY VALUES MUST NOT BE EMPTY!";
    }

    let k = arrays[i][0];
    if (keyArr.length > 0 && keyArr.indexOf(k) !== -1) {
      ResultObj[k] = arrays[i][1];
    } else {
      ResultObj[arrays[i][0]] = arrays[i][1];
    }
    keyArr = Object.keys(ResultObj);
  }

  return ResultObj;
};
/*  commonElements : For this function, take into account a variable number of input parameters.
 *  This function will return an array of elements that appear in every array passed as input parameters.
 *  If there are no element values that appear in more than one array, return an empty array.
 */
let commonElements = (...arrays) => {
  if (arrays.length > 0) {
    arrays.forEach((arr) => {
      CheckArrayExists(arr);
      CheckArrayProper(arr);
      CheckArrayNotEmpty(arr);
      arr.forEach((val) => {
        if (val.length === 0) {
          throw "ARRAY VALUES MUST NOT BE EMPTY!";
        }
      });
    });
  } else {
    throw "ARRAY DOES NOT EXIST!";
  }

  let tempArr = [];
  let ResultArr = [];
  let countObj = [];

  //Check for Duplicate values in each Array
  for (let a = 0; a < arrays.length; a++) {
    let arry = arrays[a];
    let toFindDuplicates = (arry) =>
      arry.filter((item, index) => arry.indexOf(item) !== index);
    let duplicateElements = toFindDuplicates(arry);
    if (duplicateElements.length > 0) {
      duplicateElements.forEach((dupl) => {
        let Ind = arrays[a].indexOf(dupl);
        arrays[a].splice(Ind, 1);
      });
    }
  }

  let n = arrays.length;
  if (n >= 2) {
    for (let i = 0; i < arrays.length; i++) {
      Curr_arr = arrays[i];

      for (let j = i + 1; j < arrays.length; j++) {
        Next_arr = arrays[i + 1];
        for (let k = 0; k < Curr_arr.length; k++) {
          for (var e = 0; e < Next_arr.length; e++) {
            if (Array.isArray(Curr_arr[k]) === true) {
              if (Array.isArray(Next_arr[e]) === true) {
                let Earr1 = Curr_arr[k];
                let Earr2 = Next_arr[e];
                if (
                  Earr1.length == Earr2.length &&
                  Earr1.every(function (u, i) {
                    return u == Earr2[i];
                  })
                ) {
                  tempArr.push(Curr_arr[k]);
                }
              }
            } else {
              if (Curr_arr[k] === Next_arr[e]) tempArr.push(Curr_arr[k]);
            }
          }
        }
      }
    }

    if (tempArr.length > 1) {
      tempArr.forEach(function (c) {
        countObj[c] = (countObj[c] || 0) + 1;
      });
      let maxVal = Math.max(...Object.values(countObj));
      let KeyValArr;
      let KeyArr;
      KeyValArr = Object.values(countObj);
      KeyArr = Object.keys(countObj);

      for (let k = 0; k < KeyValArr.length; k++) {
        if (KeyValArr[k] == maxVal) {
          if (KeyArr[k] === "undefined") {
            ResultArr.push(undefined);
          } else if (KeyArr[k] === "true") {
            ResultArr.push(true);
          } else if (KeyArr[k] === "false") {
            ResultArr.push(false);
          } else if (KeyArr[k] === "null") {
            ResultArr.push(null);
          } else if (KeyArr[k] === "NaN") {
            ResultArr.push(NaN);
          } else {
            ResultArr.push(KeyArr[k]);
          }
        }
      }
    } else if (tempArr.length == 1) {
      ResultArr.push(tempArr[0]);
    } else {
      ResultArr = [];
    }
  } else {
    throw "AT LEAST TWO ARRAYS SHOULD PASSED AS INPUT!";
  }

  return ResultArr;
};

module.exports = {
  arrayStats,
  makeObjects,
  commonElements,
};
