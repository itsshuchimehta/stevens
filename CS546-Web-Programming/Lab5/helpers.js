module.exports = {
  checkId(id) {
    if (!id) throw "Error: You must provide an id to search for";
    if (typeof id !== "string") throw "Error: id must be a string";
    id = id.trim();
    if (id.length === 0)
      throw "Error: id cannot be an empty string or just spaces";
    id = Number(id);
    if (Number.isInteger(id) == false || id < 0) throw "Invalid URL Parameter";
  },
};
