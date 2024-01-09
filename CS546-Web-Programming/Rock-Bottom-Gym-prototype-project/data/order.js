const mongoCollections = require("../config/mongoCollections");
const user = mongoCollections.user;
const cartdata = mongoCollections.cart;
const order = mongoCollections.order;
const order_detail = mongoCollections.order_detail;
const { ObjectId } = require("mongodb");
let moment = require("moment");
const helper = require("../helpers");
const productData = require("./products");

//Get all cart Items
const AddToCart = async (userID, product_id, size, qty) => {
  //Code to check all the parameters
  userID = helper.checkObjectId(userID);
  helper.checkObjectId(product_id);
  if (!qty)
    throw {
      code: 404,
      message: `qty was not selected`,
    };
  qty = Number(qty);
  let result = {};
  const CartCollection = await cartdata();
  const CartDetails = await CartCollection.findOne({
    user_id: ObjectId(userID),
  });
  if (!CartDetails) {
    let productNew = {
      _id: ObjectId(),
      product_id: product_id,
      size: size,
      qty: qty,
    };
    let productArr = [];
    productArr.push(productNew);
    let newCart = {
      user_id: ObjectId(userID),
      product_details: productArr,
    };
    const CartInfo = await CartCollection.insertOne(newCart);
    if (!CartInfo.acknowledged || !CartInfo.insertedId) {
      throw { code: 500, message: "Could not insert" };
    }
    result.cartstatus = true;
  } else {
    let cart_id = CartDetails._id.toString();
    let productNew = {
      _id: ObjectId(),
      product_id: product_id,
      size: size,
      qty: qty,
    };

    const CartInfo = await CartCollection.updateOne(
      { _id: ObjectId(cart_id) },
      { $push: { product_details: productNew } }
    );
    if (CartInfo.modifiedCount === 0) {
      throw { code: 500, message: "Could not Update" };
    }
    result.cartstatus = true;
  }

  return result;
};

//Get all cart Items
const getCartItems = async (userID) => {
  //Code to check all the parameters
  userID = helper.checkObjectId(userID);

  const CartCollection = await cartdata();
  const CartDetails = await CartCollection.findOne({
    user_id: ObjectId(userID),
  });
  if (!CartDetails)
    throw {
      code: 404,
      message: `Cart is Empty`,
    };
  let result = {};
  let CartDetailsProducts = CartDetails.product_details;
  let AllProducts = [];
  if (Array.isArray(CartDetailsProducts) === true) {
    for (let i = 0; i < CartDetailsProducts.length; i++) {
      let temp = CartDetailsProducts[i];
      let product = await productData.getProductById(
        CartDetailsProducts[i].product_id
      );
      temp.name = product.name;
      temp.price = product.price;
      temp.product_img = product.product_img;
      let Amount = parseFloat(temp.qty * product.price);
      temp.TotalAmount = parseFloat(Amount);

      AllProducts.push(temp);
    }
  }

  if (AllProducts.length === 0) {
    let cart_id = CartDetails._id.toString();
    const EmptyCartInfo = await CartCollection.deleteOne({
      _id: ObjectId(cart_id),
    });

    if (EmptyCartInfo.deletedCount === 0) {
      throw {
        code: 404,
        message: `Could not delete`,
      };
    }
    throw {
      code: 404,
      message: `Cart is Empty`,
    };
  }
  let total = 0;

  AllProducts.forEach((product) => {
    total = parseFloat(total + product.TotalAmount);
  });

  result.currentProduct = AllProducts;
  result.totalPrice = Number(total).toFixed(2);

  return result;
};
//Remove product by cart id
const RemoveFromCartByProductid = async (cartProductID) => {
  //Code to check all the parameters
  cartProductID = helper.checkObjectId(cartProductID);

  const CartCollection = await cartdata();
  const CartDetails = await CartCollection.findOne({
    product_details: { $elemMatch: { _id: ObjectId(cartProductID) } },
  });
  if (!CartDetails)
    throw {
      code: 404,
      message: `Cart Item not found`,
    };

  const deletedProduct = await CartCollection.updateMany(
    {},
    {
      $pull: {
        product_details: { _id: ObjectId(cartProductID) },
      },
    }
  );

  let cart_id = CartDetails._id.toString();

  let UpdatedCart = await CartCollection.findOne({
    _id: ObjectId(cart_id),
  });

  return UpdatedCart;
};

const PlaceOrder = async (userID) => {
  //Code to check all the parameters
  userID = helper.checkObjectId(userID);
  //get cart
  let CartData = await getCartItems(userID);
  let result = {};

  if (!CartData) throw { code: 404, message: `No data Found` };
  let count = await GetAllOrders();
  let orderNO = count.length;
  orderNO = orderNO + 1;
  let today = moment().format("MM-DD-YYYY");
  let newOrder = {
    user_id: userID,
    order_number: orderNO,
    order_date: today,
    final_amount: CartData.totalPrice,
  };
  //create Order
  const OrderCollection = await order();
  const OrderInfo = await OrderCollection.insertOne(newOrder);
  if (!OrderInfo.acknowledged || !OrderInfo.insertedId) {
    throw { code: 500, message: "Could not insert" };
  }

  //create order details per product
  const newOrderId = OrderInfo.insertedId.toString();

  let CartProducts = [];
  CartProducts = CartData.currentProduct;

  for (let i = 0; i < CartProducts.length; i++) {
    for (let j = 0; j < CartProducts[i].qty; j++) {
      let newOrderDetail = {
        order_id: ObjectId(newOrderId),
        user_id: userID,
        product_id: ObjectId(CartProducts[i].product_id),
        size: CartProducts[i].size,
        price: CartProducts[i].price,
      };
      const OrderDetailCollection = await order_detail();
      const OrderDetailInfo = await OrderDetailCollection.insertOne(
        newOrderDetail
      );
      if (!OrderDetailInfo.acknowledged || !OrderDetailInfo.insertedId) {
        throw { code: 500, message: "Could not insert" };
      }
    }
  }
  //Empty The Cart
  let emptycartstatus = await EmptyTheCart(userID);

  if (emptycartstatus !== true)
    throw { code: 500, message: `Something Went Wrong` };

  result.orderstatus = true;

  return result;
};

//Empty the Cart
const EmptyTheCart = async (userID) => {
  //Code to check all the parameters
  userID = helper.checkObjectId(userID);

  const CartCollection = await cartdata();
  const CartDetails = await CartCollection.findOne({
    user_id: ObjectId(userID),
  });

  if (!CartDetails)
    throw {
      code: 404,
      message: `Data  not found`,
    };

  let cart_id = CartDetails._id.toString();
  const EmptyCartInfo = await CartCollection.deleteOne({
    _id: ObjectId(cart_id),
  });

  if (EmptyCartInfo.deletedCount === 0) {
    throw {
      code: 404,
      message: `Could not delete`,
    };
  }
  return true;
};

//GetAllOrders
const GetAllOrders = async () => {
  const OrderCollection = await order();
  const AllOrders = await OrderCollection.find({}).toArray();
  for (let i = 0; i < AllOrders.length; i++) {
    AllOrders[i]._id = AllOrders[i]._id.toString();
  }
  return AllOrders;
};

module.exports = {
  AddToCart,
  getCartItems,
  RemoveFromCartByProductid,
  PlaceOrder,
  GetAllOrders,
  EmptyTheCart,
};
