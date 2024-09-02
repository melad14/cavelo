import { cartModel } from "../../../databases/models/cart.js"
import { userModel } from "../../../databases/models/users.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js"
import { sendNotificationToSpecificUser } from "../notification/oneSignalPushNotification.js";
import { orderModel } from './../../../databases/models/Order.js';

import Pusher from 'pusher';


const pusher = new Pusher({
  appId: "1832769",
  key: "74fa23b5f9fdd3fa37f0",
  secret: "c59f35157bcebbfb400a",
  cluster: "eu",
  useTLS: true
});


const ctreateCashOrder = catchAsyncErr(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppErr('cart not found', 404));

  req.body.user = req.user._id;
  req.body.cartItems = cart.cartItems;
  req.body.totalOrderPrice = cart.totalPriceAfterDiscount;
  req.body.discount = cart.discount;

  const order = new orderModel(req.body);
  await order.save();

  if (order) {
    await cartModel.findOneAndDelete({ user: req.user._id });
    pusher.trigger('cavelo', 'newOrder', order);


    const admins = await userModel.find({ role: "admin" })


    for (let admin of admins) {

      if (admin.subscriptionId) {

        const title = "New order"
        const message = "please check New order"
        const playerId = admin.subscriptionId
        await sendNotificationToSpecificUser(playerId, title, message);
      }
    }

    res.status(200).json({ "message": "success", "statusCode": 200, order });
  } else {
    return next(new AppErr('order not created', 400));
  }
});

export const updateOrder = catchAsyncErr(async (req, res) => {

  const { id } = req.params;
  const { item, quantity, size, extraIngredients,basePrice, totalPrice } = req.body;

  const order = await orderModel.findById(id)
  const newCartItem = { item, quantity, size, basePrice,extraIngredients };


  order.cartItems.push(newCartItem);
  order.totalOrderPrice = order.totalOrderPrice + totalPrice
  await order.save();

  return res.status(200).json({ "message": " success", "statusCode": 200, order });

});

export const updateItemQuantity = catchAsyncErr(async (req, res) => {
  const { orderId, cartItemId, quantity, size, extraIngredients } = req.body;

  // Find the order by ID
  const order = await orderModel.findById(orderId);

  // Find the index of the item in the cartItems array
  const cartItemIndex = order.cartItems.findIndex(
    item => item._id.toString() === cartItemId
  );

  // Get the item to update
  const itemToUpdate = order.cartItems[cartItemIndex];

  // Calculate the current total price of the item in the cart
  const currentItemTotalPrice =
    itemToUpdate.quantity * ((itemToUpdate.size?.price || itemToUpdate.basePrice) + itemToUpdate.extraIngredients.reduce((acc, curr) => acc + curr.price, 0));

  // Update the item's properties
  if (quantity) itemToUpdate.quantity = quantity;
  if (size) itemToUpdate.size = size;
  if (extraIngredients) itemToUpdate.extraIngredients = extraIngredients;

  // Calculate the new total price of the item after the updates
  const newItemTotalPrice =
    itemToUpdate.quantity * ((itemToUpdate.size?.price || itemToUpdate.basePrice) + itemToUpdate.extraIngredients.reduce((acc, curr) => acc + curr.price, 0));

  // Adjust the total order price
  order.totalOrderPrice = order.totalOrderPrice - currentItemTotalPrice + newItemTotalPrice;

  // Save the order
  await order.save();

  // Send the updated order as the response
  res.json({ message: "success", statusCode: 200, order });
});
export const removeItem = catchAsyncErr(async (req, res) => {
  const { orderId, cartItemId } = req.body;

  const order = await orderModel.findById(orderId);

  const cartItemIndex = order.cartItems.findIndex(
    item => item._id.toString() === cartItemId
  );


  const itemToRemove = order.cartItems[cartItemIndex];
  const itemTotalPrice =
    itemToRemove.quantity * ( (itemToRemove.size?.price || itemToRemove.basePrice ) + itemToRemove.extraIngredients.reduce((acc, curr) => acc + curr.price, 0));

  order.cartItems.splice(cartItemIndex, 1);

  order.totalOrderPrice -= itemTotalPrice;

  await order.save();

  res.json({ "message": "success", "statusCode": 200, order });

})


const getSpecificorders = catchAsyncErr(async (req, res, next) => {

  let orders = await orderModel.find({ user: req.user._id })
    .select('-cartItems  -user -tableNumber').sort({ createdAt: -1 });

  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})


const AdminGetOrder = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params
  let order = await orderModel.findById(id)
    .populate({
      path: 'cartItems.item',
      select: 'image name basePrice description _id'
    })
    .populate({
      path: 'user',
      select: 'first_name last_name phone role _id'
    })
  if (!order) return next(new AppErr('order not found', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, order })

})

const userGetOrder = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params
  let order = await orderModel.findById(id)
    .populate({
      path: 'cartItems.item',
      select: 'image name basePrice description _id'
    })
  res.status(200).json({ "message": " success", "statusCode": 200, order })

})

const getAllorders = catchAsyncErr(async (req, res, next) => {

  let orders = await orderModel.find().select('-cartItems ')
    .populate({
      path: 'user',
      select: 'first_name last_name phone role _id'
    })
  if (!orders) return next(new AppErr('orders not found', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})
export const searchOrders = catchAsyncErr(async (req, res, next) => {
  const { search } = req.body;

  let query = {};

  if (search) {
    query = {
      $or: [
        { "shippingAddress.street": { $regex: search, $options: 'i' } },
        { "shippingAddress.city": { $regex: search, $options: 'i' } },
        { "shippingAddress.phone": { $regex: search, $options: 'i' } },
        { "shippingAddress.secondPhone": { $regex: search, $options: 'i' } }
      ]
    };
  }

  let orders = await orderModel.find(query).select('-cartItems ')
    .populate({
      path: 'user',
      select: 'first_name last_name phone role _id'
    });

  res.status(200).json({ message: "success", statusCode: 200, orders });
});


export const getTodayorders = catchAsyncErr(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Find orders created today
  const orders = await orderModel.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  }).select('-cartItems ')
    .populate({
      path: 'user',
      select: 'first_name last_name phone role _id'
    })
  if (!orders) return next(new AppErr('No orders found for today', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})
export const getOrdersByDay = catchAsyncErr(async (req, res, next) => {
  const { date } = req.body;

  if (!date) {
    return next(new AppErr('Date is required', 400));
  }

  // Parse the date in the format DD-MM-YYYY
  const [day, month, year] = date.split('-');
  const specificDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date

  if (isNaN(specificDate.getTime())) {
    return next(new AppErr('Invalid date format', 400));
  }

  // Set the start and end of the specific day
  specificDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(specificDate);
  nextDay.setDate(specificDate.getDate() + 1);

  // Find orders created on the specific day
  const orders = await orderModel.find({
    createdAt: {
      $gte: specificDate,
      $lt: nextDay
    }
  }).select('-cartItems ')
    .populate({
      path: 'user',
      select: 'first_name last_name phone role _id'
    })

  if (!orders.length) return next(new AppErr('No orders found for the specified day', 404));

  res.status(200).json({
    message: "Success",
    statusCode: 200,
    orders
  });

})

const complete = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;

  let order = await orderModel.findByIdAndUpdate(id, { iscomplete: true }, { new: true });
  pusher.trigger('cavelo', 'orderComplete', order);
  let user = await userModel.findById(order.user)

  let title = "order completed"
  let message = "your order is completed and ready to delivered "
  let playerId = user.subscriptionId
  await sendNotificationToSpecificUser(playerId, title, message)
  res.status(200).json({ "message": "Success", "statusCode": 200, order });
});

const getCurrentDayInvoices = catchAsyncErr(async (req, res, next) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const orders = await orderModel.find({
    createdAt: { $gte: today, $lt: tomorrow },
    paid: true
  }).select('paymentmethod totalOrderPrice orderNum createdAt _id')
  if (!orders) return next(new AppErr('orders not found', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})
export const getMonthInvoices = catchAsyncErr(async (req, res, next) => {
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const orders = await orderModel.find({
    createdAt: { $gte: firstDayOfMonth, $lt: firstDayOfNextMonth },
    paid: true
  }).select('paymentmethod totalOrderPrice orderNum createdAt _id');

  if (!orders) return next(new AppErr('Orders not found', 404));
  res.status(200).json({ message: "Success", statusCode: 200, orders });
});

export const getIncomesByDay = catchAsyncErr(async (req, res, next) => {
  const { date } = req.body;

  if (!date) {
    return next(new AppErr('Date is required', 400));
  }

  const [day, month, year] = date.split('-');
  const specificDate = new Date(year, month - 1, day);

  if (isNaN(specificDate.getTime())) {
    return next(new AppErr('Invalid date format', 400));
  }

  // Set the start and end of the specific day
  specificDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(specificDate);
  nextDay.setDate(specificDate.getDate() + 1);

  // Find orders created on the specific day
  const orders = await orderModel.find({
    createdAt: {
      $gte: specificDate,
      $lt: nextDay
    },
    paid: true
  }).select(('paymentmethod totalOrderPrice orderNum createdAt _id'));

  if (!orders.length) return next(new AppErr('No orders found for the specified day', 404));

  res.status(200).json({
    message: "Success",
    statusCode: 200,
    orders
  });

})

export const deliveryPerson = catchAsyncErr(async (req, res, next) => {
  const { deliveryPerson } = req.body
  const { id } = req.params
  await orderModel.findByIdAndUpdate(id, { deliveryPerson }, { new: true })

  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const delivered = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  const order = await orderModel.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: new Date() }, { new: true })
  pusher.trigger('cavelo', 'orderDelivered', order);
  let user = await userModel.findById(order.user)
  let title = "order delivered"
  let message = "your order is delivered  "
  let playerId = user.subscriptionId
  await sendNotificationToSpecificUser(playerId, title, message)

  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const paid = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  const order = await orderModel.findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
  pusher.trigger('cavelo', 'orderPaid', order);
  let user = await userModel.findById(order.user)
  let title = "order paid"
  let message = "your order is paid"
  let playerId = user.subscriptionId
  await sendNotificationToSpecificUser(playerId, title, message)
  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const cancel = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  const order = await orderModel.findByIdAndUpdate(id, { cancel: true }, { new: true })
  pusher.trigger('cavelo', 'orderCanceld', order);
  let user = await userModel.findById(order.user)
  let title = "order canceled"
  let message = "your order is canceled "
  let playerId = user.subscriptionId
  await sendNotificationToSpecificUser(playerId, title, message)
  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const userGetOrderHistory = catchAsyncErr(async (req, res, next) => {
  const userId = req.user._id

  const orders = await orderModel.find({ user: userId })
    .populate('cartItems.item').sort({ createdAt: -1 });


  const filteredItems = orders.flatMap(order =>
    order.cartItems.map(cartItem => ({

      _id: cartItem.item?._id,
      image: cartItem.item?.image,
      name: cartItem.item?.name,
      description: cartItem.item?.description,
      basePrice: cartItem.item?.basePrice,
      extraIngredientPrices: cartItem.item?.extraIngredientPrices,
      sizes: cartItem.item?.sizes,
      hide: cartItem.item?.hide,
    }))
  );



  res.status(200).json({ "message": "Success", "statusCode": 200, orders: filteredItems });
});

export {
  ctreateCashOrder, cancel, getSpecificorders, getCurrentDayInvoices,
  getAllorders, complete, paid, delivered, AdminGetOrder, userGetOrder, userGetOrderHistory
}

