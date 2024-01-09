const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: 
NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */
module.exports = {
  blog: getCollectionFn("blog"),
  blog_category: getCollectionFn("blog_category"),
  cart: getCollectionFn("cart"),
  member: getCollectionFn("member"),
  membership_detail: getCollectionFn("membership_detail"),
  order: getCollectionFn("order"),
  order_detail: getCollectionFn("order_detail"),
  product: getCollectionFn("product"),
  return: getCollectionFn("return"),
  subscription_plan: getCollectionFn("subscription_plan"),
  user: getCollectionFn("user"),
  user_group: getCollectionFn("user_group"),
};
