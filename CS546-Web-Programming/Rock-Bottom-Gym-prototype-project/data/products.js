const mongoCollections = require("../config/mongoCollections");
const product = mongoCollections.product;
const { ObjectId } = require("mongodb");
const moment = require("moment");
const helper = require("../helpers");

//Function to create a product
const createProduct = async (
  name,
  description,
  price,
  category,
   size,
  product_img,
  color
) => {
  //Code to check all the parameters
  name = helper.checkProductName(name);
  description = helper.checkProductDescription(description);
  price = helper.checkProductPrice(price);
  category = helper.checkProductCategory(category);
  // product_img = helper.checkProductImage(product_img);
  console.log(product_img);
  //Converting the price to float
  price = parseFloat(price);

  //Retriving product collections from the database
  const productCollection = await product();

  //Storing the date when the product was created in the database
  let date = moment().format("MM/DD/YYYY");

  //Creating a new product object
  const new_product = {
    name: name,
    description: description,
    price: price,
    category: category,
    size: size,
    overallrating: 0,
    ratings: [],
    comments: [],
    show_on_website: true,
    product_img: product_img,
    color: color,
    date: date,
  };

  //Inserting the new object created  in the product collection
  const insertInfo = await productCollection.insertOne(new_product);

  //Checking if the product is successfully inserted or not
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { code: 500, message: `Could not add the product` };

  // Retriving inserted product id
  const newId = insertInfo.insertedId.toString();

  //Retriving the product from the id and returning it
  const productAdded = await getProductById(newId);
  return productAdded;
};

//Function to get a product By Id
const getProductById = async (productId) => {
  //Code to check the productId parameters
  productId = helper.checkObjectId(productId);

  //Retriving product collections from the database
  const productCollection = await product();

  //Retriving a product by Id
  const productById = await productCollection.findOne({
    _id: ObjectId(productId),
  });

  //Checing if the product is retrived from the database. If not throw an error
  if (productById === null)
    throw {
      code: 404,
      message: `Can't find the product. Please check after some time`,
    };

  productById._id = productById._id.toString();
  return productById;
};

//Function to get all the Products
const getAllProducts = async () => {
  //Retriving product collections from the database
  const productCollection = await product();

  //Getting the list of products and converting it to array
  const productList = await productCollection.find({}).toArray();

  //Checking if the movieList is null or not
  if (!productList || productList.length === 0)
    throw {
      code: 404,
      message: `No Products Found. Sorry for the inconvenience. Please check after some time`,
    };

  //Converting the product id to string
  for (let i = 0; i < productList.length; i++) {
    productList[i]._id = productList[i]._id.toString();
  }

  //Returning products
  return productList;
};

//Update the product
const updateProduct = async (
  productId,
  name,
  description,
  price,
  category,
  size,
  product_img,
  color
) => {
  //Code to check all the parameters
  name = helper.checkProductName(name);
  description = helper.checkProductDescription(description);
  price = helper.checkProductPrice(price);
  category = helper.checkProductCategory(category);
  product_img = helper.checkProductImage(product_img);

  //Retriving product collections from the database
  const productCollection = await product();

  //Creating a updated Product Object
  const updatedProduct = {
    name: name,
    description: description,
    price: price,
    category: category,
    size: size,
    product_img: product_img,
    color: color,
  };

  const updatedInfo = await productCollection.updateOne(
    { _id: ObjectId(productId) },
    { $set: updatedProduct }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { code: 400, message: "could not update product successfully" };
  }

  let new_product = await getMovieById(movieId);
  return new_product;
};

//Function to get a product By Name
const getProductByName = async (name) => {
  //Code to check all the parameters

  //name = helper.checkProductName(name);

  //Retriving product collections from the database
  const productCollection = await product();

  let regexp = new RegExp(name, "i");

  //Retriving a product by Name
  const products = await productCollection.find({ name: regexp }).toArray();

  //Checing if the product is retrived from the database. If not throw an error
  if (!products || products.length === 0)
    throw {
      code: 404,
      message: `No products found related to ${name} found. Please go back and try again`,
    };
  return products;
};

//Function to get a product By Name
const addLikeProduct = async (commentId, productId, userId) => {
  //Code to check all the parameters
  commentId = helper.checkObjectId(commentId);
  productId = helper.checkObjectId(productId);
  userId = helper.checkObjectId(userId);

  //Retriving product collections from the database
  const productCollection = await product();

  //Checking if the like is present in our product
  let findLike = await productCollection.findOne({
    "comments.likes.user_id": ObjectId(userId),
  });

  //Checking if the dislike is present in our product
  let findDisLike = await productCollection.findOne({
    "comments.dislikes.user_id": ObjectId(userId),
  });

  //User liked the comment when he has already disliked the comment
  if (findDisLike) {
    //Remove the dislike from the product
    let insertedInfoDislike = await productCollection.updateOne(
      {
        "comments._id": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.dislikes": {
            user_id: ObjectId(userId),
          },
        },
      }
    );

    //Add the like in the database
    let insertedInfoLike = await productCollection.updateOne(
      {
        "comments._id": ObjectId(commentId),
      },
      {
        $push: {
          "comments.$.likes": {
            _id: new ObjectId(),
            user_id: ObjectId(userId),
          },
        },
      }
    );

    let status = {
      like: true,
      dislike: false,
    };
    return status;
  }

  //User is liking the comment twice. So we will remove the like
  if (findLike) {
    //Remove the like from the product
    let insertedInfolike = await productCollection.updateOne(
      {
        "comments._id": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.likes": {
            user_id: ObjectId(userId),
          },
        },
      }
    );

    let status = {
      like: false,
      dislike: false,
    };

    return status;
  }

  //Insert the like in the product collection
  let insertedInfo = await productCollection.updateOne(
    {
      "comments._id": ObjectId(commentId),
    },
    {
      $push: {
        "comments.$.likes": {
          _id: new ObjectId(),
          user_id: ObjectId(userId),
        },
      },
    }
  );

  let status = {
    like: true,
    dislike: false,
  };
  return status;
};

//Function to get a product By Name
const addDislikeProduct = async (commentId, productId, userId) => {
  //Code to check all the parameters
  commentId = helper.checkObjectId(commentId);
  productId = helper.checkObjectId(productId);
  userId = helper.checkObjectId(userId);

  //Retriving product collections from the database
  const productCollection = await product();

  //Checking if the like is present in our product
  let findLike = await productCollection.findOne({
    "comments.likes.user_id": ObjectId(userId),
  });

  //Checking if the dislike is present in our product
  let findDisLike = await productCollection.findOne({
    "comments.dislikes.user_id": ObjectId(userId),
  });

  //User disliked the comment when he has already liked the comment
  if (findLike) {
    //Remove the like from the product
    let insertedInfolike = await productCollection.updateOne(
      {
        "comments._id": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.likes": {
            user_id: ObjectId(userId),
          },
        },
      }
    );

    //Insert the dislike in the product
  }

  if (findDisLike) {
    //Remove the dislike from the product
    let insertedInfolike = await productCollection.updateOne(
      {
        "comments._id": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.dislikes": {
            user_id: ObjectId(userId),
          },
        },
      }
    );

    let status = {
      like: false,
      dislike: false,
    };

    return status;
  }

  //Insert the like in the product collection
  let insertedInfo = await productCollection.updateOne(
    {
      "comments._id": ObjectId(commentId),
    },
    {
      $push: {
        "comments.$.dislikes": {
          _id: new ObjectId(),
          user_id: ObjectId(userId),
        },
      },
    }
  );

  let status = {
    like: false,
    dislike: true,
  };
  return status;
};

const addComment = async (comment, productId, userId) => {
  //Retriving product collections from the database
  const productCollection = await product();

  //Insert the like in the product collection
  let insertedInfo = await productCollection.updateOne(
    {
      _id: ObjectId(productId),
    },
    {
      $push: {
        comments: {
          _id: new ObjectId(),
          user_id: ObjectId(userId),
          comment: comment,
          status: true,
          likes: [],
          dislikes: [],
        },
      },
    }
  );
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  getProductByName,
  addLikeProduct,
  addDislikeProduct,
  addComment,
};
