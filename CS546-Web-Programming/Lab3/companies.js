const axios = require("axios");
async function getCompany() {
  const { data } = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/90b56a2abf10cfd88b2310b4a0ae3381/raw/f43962e103672e15f8ec2d5e19106e9d134e33c6/companies.json"
  );
  return data;
}
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

const listEmployees = async (companyName) => {
  InputCheck(companyName, Object.keys({ companyName })[0]);
  let Info = await getCompany();
  let EmpInfo = await getPeople();
  let result = 0;
  let emp = [];
  if (Info.length > 0) {
    Info.forEach((data) => {
      if (data.name === companyName) {
        EmpInfo.sort(function (a, b) {
          if (a.last_name < b.last_name) {
            return -1;
          }
          if (a.last_name > b.last_name) {
            return 1;
          }
          return 0;
        });
        EmpInfo.forEach((empI) => {
          if (empI.company_id === data.id) {
            emp.push(empI.first_name + " " + empI.last_name);
          }
        });
        result = data;
        result["employees"] = emp;
      }
    });
    if (result === 0) {
      throw `No company name with "${companyName}"`;
    }
  }
  return result;
};

const sameIndustry = async (industry) => {
  InputCheck(industry, Object.keys({ industry })[0]);
  let Info = await getCompany();
  let result = [];
  if (Info.length > 0) {
    Info.forEach((data) => {
      if (data.industry === industry) {
        result.push(data);
      }
    });
    if (result.length === 0) {
      throw `No company name in "${industry}" industry`;
    }
  }
  return result;
};

const getCompanyById = async (id) => {
  InputCheck(id, Object.keys({ id })[0]);
  let Info = await getCompany();
  let result = 0;
  if (Info.length > 0) {
    Info.forEach((data) => {
      if (data.id === id) {
        result = data;
      }
    });
    if (result === 0) {
      throw "company not found!";
    }
  }
  return result;
};

module.exports = {
  listEmployees,
  sameIndustry,
  getCompanyById,
};
