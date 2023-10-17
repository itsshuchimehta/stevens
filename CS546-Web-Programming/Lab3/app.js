const people = require("./people");
const company = require("./companies");

async function main() {
  /* ================== people ================= */

  /* getPersonById */
  try {
    const result = await people.getPersonById(
      "fa36544d-bf92-4ed6-aa84-7085c6cb0440"
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await people.getPersonById(-1);
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* sameJobTitle */
  console.log("\n");

  try {
    const result = await people.sameJobTitle("HELP DESK OPERATOR");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await people.sameJobTitle();
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* getPostalCodes */
  console.log("\n");

  try {
    const result = await people.getPostalCodes("Salt Lake City", "Utah");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await people.getPostalCodes(123, 13);
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* sameCityAndState */
  console.log("\n");

  try {
    const result = await people.sameCityAndState("Salt Lake City", "Utah");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await people.sameCityAndState("      ", "New York");
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* ================== companies ================= */

  /* listEmployees */
  console.log("\n");

  try {
    const result = await company.listEmployees("Yost, Harris and Cormier");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await company.listEmployees(["123"]);
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* sameIndustry */
  console.log("\n");

  try {
    const result = await company.sameIndustry("Auto Parts:O.E.M.");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await company.sameIndustry("Abc");
    console.log(result);
  } catch (e) {
    console.log(e);
  }

  /* getCompanyById */
  console.log("\n");
  try {
    const result = await company.getCompanyById(
      "fb90892a-f7b9-4687-b497-d3b4606faddf"
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
  try {
    const result = await company.getCompanyById(1000);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

// call main
main();
