import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import { menuModel } from './../../../databases/models/MenuItem.js';
import { cartModel } from './../../../databases/models/cart.js';
import { coponModel } from './../../../databases/models/coupon.js';

function calctotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach(elm => {
    totalPrice += elm.quantity * elm.basePrice;
  });
  cart.totalPrice = totalPrice;
  if (cart.discount) {
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  } else {
    cart.totalPriceAfterDiscount = cart.totalPrice;
  }
}

const addTocart = catchAsyncErr(async (req, res, next) => {
  const { item, size, extraIngredients } = req.body;

  // Find the menu item
  let menuItem = await menuModel.findById(item);
  if (!menuItem) return next(new AppErr(`Item not found`, 404));

  req.body.basePrice = menuItem.basePrice;


  if (size) {
    const selectedSize = menuItem.sizes.find(s => s.name === size);
    if (selectedSize) {
       
      req.body.size = selectedSize;
      req.body.basePrice += selectedSize.price;
    } else {
      return next(new AppErr(`Selected size not found`, 400));
    }
  }


  if (extraIngredients && extraIngredients.length > 0) {
    req.body.extraIngredients = extraIngredients.map(extra => {
      const selectedExtra = menuItem.extraIngredientPrices.find(e => e.name === extra);
      if (selectedExtra) {
        req.body.basePrice += selectedExtra.price;
        return selectedExtra;
      } else {
        throw new AppErr(`Extra ingredient ${extra} not found`, 400);
      }
    });
  }


  let cartExist = await cartModel.findOne({ user: req.user._id });
  if (!cartExist) {
    let newCart = new cartModel({
      user: req.user._id,
      cartItems: [req.body]
    });

    newCart = await newCart.populate({
            path: 'cartItems.item',
            select: 'image name basePrice description _id'
        })
    calctotalPrice(newCart);
    await newCart.save();

    return res.status(200).json({ "message": "success", "statusCode": 200 });
  }


  let find = cartExist.cartItems.find(elm =>
    elm.item.toString() === req.body.item &&
    elm.size?.name === req.body.size?.name &&
    JSON.stringify(elm.extraIngredients) === JSON.stringify(req.body.extraIngredients)
  );

  if (find) {
    find.quantity += 1;
  } else {
    cartExist.cartItems.push(req.body);
  }

  cartExist = await cartExist.populate({
    path: 'cartItems.item',
    select: 'image name basePrice description _id'
})
  calctotalPrice(cartExist);
  await cartExist.save();

  res.status(200).json({ "message": "success", "statusCode": 200 });
});


const removeFromCart = catchAsyncErr(async (req, res, next) => {
  const result = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  ).populate({
    path: 'cartItems.item',
    select: 'image name basePrice description _id'
});


  calctotalPrice(result);
  await result.save();

  res.status(200).json({ "message": "success", "statusCode": 200 });
});


const updateQuantity = catchAsyncErr(async (req, res, next) => {
  let cartExist = await cartModel.findOne({ user: req.user._id });
  

  let item = cartExist.cartItems.find(elm => elm._id.toString() === req.params.id);
  if (!item) return next(new AppErr(`Item not found in cart`, 404));

  item.quantity = req.body.quantity;
  calctotalPrice(cartExist);
  await cartExist.save();

  res.status(200).json({ "message": "success", "statusCode": 200 });
});


const applyCoupon = catchAsyncErr(async (req, res, next) => {

  let coupon = await coponModel.findOne({ code: req.body.code, expire: { $gt: Date.now() } });
  if (!coupon) return next(new AppErr(`Coupon not available`, 404));

  let cart = await cartModel.findOne({ user: req.user._id });
  cart.discount = coupon.discount;
  calctotalPrice(cart);
  await cart.save();

  res.status(200).json({ "message": "success", "statusCode": 200, cart });
});


const getLoggedUserCart = catchAsyncErr(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id }).populate({
    path: 'cartItems.item',
    select: 'image name basePrice description _id'
});
 

  res.status(200).json({ "message": "success", "statusCode": 200, cart });
});

export {
  addTocart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  getLoggedUserCart
};
