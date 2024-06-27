import { cartModel } from "../../../databases/models/cart.js"
import { notificationModel } from "../../../databases/models/notifcation.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js"
import { orderModel } from './../../../databases/models/Order.js';



const ctreateCashOrder = catchAsyncErr(async (req, res, next) => {

    const cart = await cartModel.findById(req.params.id)
    if (!cart) return next(new AppErr('cart not found', 200))
    const totalOrderPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalPrice

    const order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAdress: req.body.shippingAdress,
        details:req.body.details,

    })
    await order.save()

    if (order) {
     
        await cartModel.findOneAndDelete({ user: req.user._id })
        return res.status(201).json({ "message": " success", order })
    } else {
        return next(new AppErr('order not found', 404))
    }
})

const getSpecificorders = catchAsyncErr(async (req, res, next) => {

    let order = await orderModel.find({ user: req.user._id }).populate('cartItems.item')
    if (!order) return next(new AppErr('order not found', 404))
    res.status(201).json({ "message": " success", order })


})
const AdminGetOrder = catchAsyncErr(async (req, res, next) => {
const {id}=req.params
    let order = await orderModel.findById(id).populate('cartItems.item')
    if (!order) return next(new AppErr('order not found', 404))
    res.status(201).json({ "message": " success", order })

})
const getAllorders = catchAsyncErr(async (req, res, next) => {

    let orders = await orderModel.find({}).populate('cartItems.item')
    if (!orders) return next(new AppErr('orders not found', 404))
    res.status(201).json({ "message": " success", orders })

})

const complete = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const { deliveryPersonName } = req.body;

    let order = await orderModel.findByIdAndUpdate(id, { isComplete: true }, { new: true });

    if (!order) return next(new AppErr('Order not found', 404));

    // Find the delivery person by name
    const deliveryPerson = await userModel.findOne({ name: deliveryPersonName, role: 'delivery' });
    if (!deliveryPerson) return next(new AppErr('Delivery person not found', 404));

    order.assignedDeliveryPerson = deliveryPerson._id;
    await order.save();

    const notification = new notificationModel({
        title: "New Order Assigned",
        message: `You have been assigned a new order. Order ID: ${order._id}`,
        notid: deliveryPerson.name
    });
    await notification.save();

    res.status(200).json({ message: "Success", order });
});

const deliverd = catchAsyncErr(async (req, res, next) => {

    const{id}=req.params
    let order = await orderModel.findByIdAndUpdate(id,{isDelivered:true, deliveredAt: new Date() },{new:true})

    res.status(201).json({ "message": " success", order })

})
const paid = catchAsyncErr(async (req, res, next) => {

    const{id}=req.params
    let order = await orderModel.findByIdAndUpdate(id,{isPaid:true,paidAt: new Date() },{new:true})

    res.status(201).json({ "message": " success", order })

})




export {
    ctreateCashOrder,
    getSpecificorders,
    getAllorders,complete,paid,deliverd,AdminGetOrder
    
    
}

