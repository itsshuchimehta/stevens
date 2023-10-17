/* ERROR CHECK */
function CheckStringExists(str) {
  if (str === undefined) {
    throw "STRING DOES NOT EXIST!";
  }
}
function CheckStringProper(str) {
  if (typeof str !== "string") {
    throw "STRING IS NOT OF THE PROPER TYPE!";
  }
}

function CheckStringNotEmpty(str) {
  if (str.length === 0) {
    throw "STRING MUST NOT BE EMPTY!";
  }
}

function CheckStringEl(str) {
  let mystr = str.replace(/\s+/g, "");
  if (mystr.length == 0) {
    throw "INPUT STRING MUST HAVE CHARACTER VALUES!";
  }
}

/* palindromes : Given a string, will return an array with any palindromes that are contained in the string in the order in which they appear in the string.
 * If there are no palindromes in the string, return an empty array.
 */
let palindromes = (string) => {
  CheckStringExists(string);
  CheckStringProper(string);
  CheckStringNotEmpty(string);
  CheckStringEl(string);

  let Str = [];
  let Result = [];
  Str = string.split(" ");
  for (let i = 0; i < Str.length; i++) {
    let newStr = Str[i].replace(/[^a-zA-Z0-9 ]/g, "");
    Str[i] = newStr;
  }
  Str.forEach((word) => {
    if (word != "") {
      let revArray = [];
      let length = word.length - 1;
      for (let i = length; i >= 0; i--) {
        revArray.push(word[i]);
      }
      let revStr = revArray.join("");
      if (word.toUpperCase() === revStr.toUpperCase()) {
        Result.push(word);
      }
    }
  });

  return Result;
};

/* replaceChar : Given string will replace every other character with alternating * and $ characters.
 * Spaces, punctuation special characters all count as characters!
 */
let replaceChar = (string) => {
  CheckStringExists(string);
  CheckStringProper(string);
  CheckStringNotEmpty(string);
  CheckStringEl(string);
  let finalStr = "";
  if (string != "") {
    let curr_pointer = "$";
    let newStr = "";
    string = string.trim();
    for (let k = 0; k < string.length; k++) {
      if (k == 0) {
        newStr += string[k];
        curr_pointer = curr_pointer == "*" ? "$" : "*";
      } else if (k % 2 != 0 && k != 0) {
        newStr += string[k].replace(string[k], curr_pointer);
      } else {
        newStr += string[k];
        curr_pointer = curr_pointer == "*" ? "$" : "*";
      }
      finalStr = newStr;
    }
  }
  return finalStr;
};
/* charSwap : Given string1 and string2
 * return the concatenation of the two strings, separated by a space and swapping the first 4 characters of each.
 */
let charSwap = (string1, string2) => {
  if (string1 === undefined || string2 === undefined) {
    throw "BOTH STRINGS MUST EXIST!";
  }
  if (typeof string1 !== "string") {
    throw "STRING-1 IS NOT OF THE PROPER TYPE!";
  }
  if (typeof string2 !== "string") {
    throw "STRING-2 IS NOT OF THE PROPER TYPE!";
  }
  CheckStringEl(string1);
  CheckStringEl(string2);

  let finalStr = "";
  if (string1.length >= 4 && string2.length >= 4) {
    let s1 = string2.slice(0, 4) + string1.slice(4, string1.length);
    let s2 = string1.slice(0, 4) + string2.slice(4, string1.length);
    finalStr = s1 + " " + s2;
  } else {
    throw "EACH STRING MUST HAVE AT LEAST 4 CHARACTERS!";
  }
  return finalStr;
};

module.exports = {
  palindromes,
  replaceChar,
  charSwap,
};
