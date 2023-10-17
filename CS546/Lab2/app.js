/* TODO: Import the functions from your three modules here and write two test cases for each function.. You should have a total of 18 test cases. 
do not forget that you need to create the package.json and add the start command to run app.js as the starting script*/

const arrayUtils = require("./arrayUtils");
const stringUtils = require("./stringUtils");
const objectUtils = require("./objectUtils");

/* ======================================= arrayUtils ======================================= */

//-----> arrayStats Tests
// Should Pass
try {
  console.log(arrayUtils.arrayStats([7, 9, 11, 15, 19, 20, 35, 0]));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(arrayUtils.arrayStats([]));
} catch (e) {
  console.log(e);
}

//-----> makeObjects Tests
console.log("\n");
// Should Pass
try {
  console.log(
    arrayUtils.makeObjects(
      ["foo", "bar"],
      ["name", "Patrick Hill"],
      ["foo", "not bar"]
    )
  );
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(arrayUtils.makeObjects([1], [1, 2]));
} catch (e) {
  console.log(e);
}

//-----> commonElements Tests
console.log("\n");
const arr9 = ["2D case", ["foo", "bar"], "bye bye"];
const arr10 = [["foo", "bar"], true, "String", 10];
// Should Pass
try {
  console.log(arrayUtils.commonElements(arr9, arr10));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(arrayUtils.commonElements());
} catch (e) {
  console.log(e);
}

/* ======================================= stringUtils ======================================= */

//-----> palindromes Tests
console.log("\n");
// Should Pass
try {
  console.log(stringUtils.palindromes("Wow! Did you see that racecar go?"));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(stringUtils.palindromes(["hello there"]));
} catch (e) {
  console.log(e);
}

//-----> replaceChar Tests
console.log("\n");
// Should Pass
try {
  console.log(
    stringUtils.replaceChar("Hello, How are you? I hope you are well")
  );
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(stringUtils.replaceChar(123));
} catch (e) {
  console.log(e);
}

//-----> charSwap Tests
console.log("\n");
// Should Pass
try {
  console.log(stringUtils.charSwap("hello", "world"));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(stringUtils.charSwap("h", "e"));
} catch (e) {
  console.log(e);
}

/* ======================================= objectUtils ======================================= */

//-----> deepEquality Tests
console.log("\n");
const val1 = {
  a: { sA: "Hello", sB: "There", sC: "Class" },
  b: 7,
  c: true,
  d: "Test",
};
const val2 = {
  c: true,
  b: 7,
  d: "Test",
  a: { sB: "There", sC: "Class", sA: "Hello" },
};
// Should Pass
try {
  console.log(objectUtils.deepEquality(val1, val2));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(objectUtils.deepEquality("foo", "bar"));
} catch (e) {
  console.log(e);
}

//-----> commonKeysValues Tests
console.log("\n");
const first = { name: { first: "Patrick", last: "Hill" }, age: 46 };
const second = { school: "Stevens", name: { first: "Patrick", last: "Hill" } };
// Should Pass
try {
  console.log(objectUtils.commonKeysValues(first, second));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(objectUtils.commonKeysValues("foo", "bar"));
} catch (e) {
  console.log(e);
}

//-----> calculateObject Tests
console.log("\n");
// Should Pass
try {
  console.log(objectUtils.calculateObject({ a: 3, b: 7, c: 5 }, (n) => n * 2));
} catch (e) {
  console.log(e);
}
// Should Fail
try {
  console.log(objectUtils.calculateObject("12", (n) => n * 2));
} catch (e) {
  console.log(e);
}
