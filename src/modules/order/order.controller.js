import { cartModel } from "../../../databases/models/cart.js"
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js"
import { orderModel } from './../../../databases/models/Order.js';
import { notificationModel } from './../../../databases/models/notifcation.js';
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

    const notification = new notificationModel({
      title: "New order Assigned",
      message: `You have been assigned a new order. Order ID: ${order._id}`,
      notid: req.user.first_name
    });
    await notification.save();



    res.status(200).json({ "message": "success", "statusCode": 200, order });
  } else {
    return next(new AppErr('order not created', 400));
  }
});


const getSpecificorders = catchAsyncErr(async (req, res, next) => {

  let orders = await orderModel.find({ user: req.user._id })
    .select('-cartItems -shippingAddress -user -tableNumber');

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
    select: 'first_name last_name phone _id'
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

  let orders = await orderModel.find().select('-cartItems -shippingAddress')
  .populate({
    path: 'user',
    select: 'first_name last_name phone _id'
  })
  if (!orders) return next(new AppErr('orders not found', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})

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
  }).select('-cartItems -shippingAddress')
  .populate({
    path: 'user',
    select: 'first_name last_name phone _id'
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
  }).select('-cartItems -shippingAddress')
  .populate({
    path: 'user',
    select: 'first_name last_name phone _id'
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

  if (!order) return next(new AppErr('Order not found', 404));

  res.status(200).json({ "message": "Success", "statusCode": 200, order });
});

const getAllordersIncomes = catchAsyncErr(async (req, res, next) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Find orders created today
  const orders = await orderModel.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow
    },
    paid: true
  }).select('paymentmethod totalOrderPrice createdAt _id')
  if (!orders) return next(new AppErr('orders not found', 404))
  res.status(200).json({ "message": " success", "statusCode": 200, orders })

})
export const getIncomesByDay = catchAsyncErr(async (req, res, next) => {
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
    },
    paid: true
  }).select(('paymentmethod totalOrderPrice createdAt _id'));

  if (!orders.length) return next(new AppErr('No orders found for the specified day', 404));

  res.status(200).json({
    message: "Success",
    statusCode: 200,
    orders
  });

})

const deliverd = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  await orderModel.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: new Date() }, { new: true })

  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const paid = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  await orderModel.findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })

  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const cancel = catchAsyncErr(async (req, res, next) => {

  const { id } = req.params
  await orderModel.findByIdAndUpdate(id, { cancel: true }, { new: true })
  res.status(200).json({ "message": " success", "statusCode": 200 })

})

const userGetOrderHistory = catchAsyncErr(async (req, res, next) => {
  const userId = req.user._id;

  const orders = await orderModel.find({ user: userId })
    .populate({
      path: 'cartItems.item',
      select: 'image name basePrice description extraIngredientPrices sizes _id'
    })

  const filteredItems = orders.flatMap(order =>
    order.cartItems.map(cartItem => ({

      _id: cartItem.item._id,
      image: cartItem.item.image,
      name: cartItem.item.name,
      description: cartItem.item.description,
      basePrice: cartItem.item.basePrice,
      extraIngredientPrices: cartItem.item.extraIngredientPrices,
      sizes: cartItem.item.sizes,
    }))
  );



  res.status(200).json({ "message": "Success", "statusCode": 200, orders: filteredItems });
});


export {
  ctreateCashOrder, cancel,
  getSpecificorders, getAllordersIncomes,
  getAllorders, complete,
  paid, deliverd, AdminGetOrder, userGetOrder, userGetOrderHistory


}

