import { cartModel } from "../../../databases/models/cart.js"
import { userModel } from "../../../databases/models/users.js";
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

    const cart = await cartModel.findById(req.params.id)
    if (!cart) return next(new AppErr('cart not found', 200))
    req.body.user = req.user._id
    req.body.cartItems = cart.cartItems
    req.body.totalOrderPrice = cart.totalPriceAfterDiscount
    const order = new orderModel(req.body)
    await order.save()

    if (order) {

        await cartModel.findOneAndDelete({ user: req.user._id })
        pusher.trigger('cavelo', 'newOrder', order);
  
        const notification = new notificationModel({
            title: "New order Assigned",
            message: `You have been assigned a new order. Order ID: ${order._id}`,
            notid: req.user.first_name
          });
          await notification.save();
        
         
        return res.status(200).json({ "message": " success","statusCode":200, order })
    } else {
        return next(new AppErr('order not found', 404))
    }
})

const getSpecificorders = catchAsyncErr(async (req, res, next) => {

    let order = await orderModel.find({ user: req.user._id }).select('-cartItems -shippingAddress -user  -tableNumber ')
    if (!order) return next(new AppErr('order not found', 404))
    res.status(200).json({ "message": " success","statusCode":200, order })

})


const AdminGetOrder = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    let order = await orderModel.findById(id).populate({
        path: 'cartItems.item',
        select: 'image name basePrice description _id'
    }).populate('assignedDeliveryPerson', 'first_name last_name -_id')
    if (!order) return next(new AppErr('order not found', 404))
    res.status(200).json({ "message": " success","statusCode":200, order })

})

const userGetOrder = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    let order = await orderModel.findById(id)
    .populate({
        path: 'cartItems.item',
        select: 'image name basePrice description _id'
    })
    .populate('assignedDeliveryPerson','first_name last_name -_id')
   
    res.status(200).json({ "message": " success","statusCode":200, order })

})
const getAllorders = catchAsyncErr(async (req, res, next) => {

    let orders = await orderModel.find().select('-cartItems -shippingAddress')
    if (!orders) return next(new AppErr('orders not found', 404))
    res.status(200).json({ "message": " success","statusCode":200, orders })

})

const completeInDoor = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;

    let order = await orderModel.findByIdAndUpdate(id, { iscomplete: true }, { new: true });

    if (!order) return next(new AppErr('Order not found', 404));

    res.status(200).json({ "message": "Success","statusCode":200, order });
});

const completeDelivry = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const { deliveryPerson } = req.body;

    let order = await orderModel.findByIdAndUpdate(id, { iscomplete: true , assignedDeliveryPerson:deliveryPerson }, { new: true });

    if (!order) return next(new AppErr('Order not found', 404));

    await order.populate('assignedDeliveryPerson', 'first_name last_name -_id')
    await order.save();

    res.status(200).json({ "message": "Success", "statusCode":200,order });
   
});

const deliverd = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
    let order = await orderModel.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: new Date() }, { new: true })
    await order.populate('assignedDeliveryPerson', 'first_name last_name -_id')
    res.status(200).json({ "message": " success","statusCode":200, order })

})
const paid = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
    let order = await orderModel.findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
    await order.populate('assignedDeliveryPerson', 'first_name last_name -_id')
    res.status(200).json({ "message": " success","statusCode":200, order })

})



const userGetOrderHistory = catchAsyncErr(async (req, res, next) => {
    const userId = req.user._id;
    
    const orders = await orderModel.find({ user: userId })
        .populate({
            path: 'cartItems.item',
            select: 'image name basePrice description _id'
        }) 

        const filteredItems = orders.flatMap(order => 
            order.cartItems.map(cartItem => ({
                
                _id: cartItem.item._id,
                image: cartItem.item.image,
                name: cartItem.item.name,
                description: cartItem.item.description,
                basePrice: cartItem.item.basePrice,
            }))
        );
   
    

    res.status(200).json({   "message": "Success",   "statusCode": 200,orders:filteredItems});
});


export {
    ctreateCashOrder,
    getSpecificorders,
    getAllorders, completeDelivry, completeInDoor,
    paid, deliverd, AdminGetOrder,userGetOrder,userGetOrderHistory


}

