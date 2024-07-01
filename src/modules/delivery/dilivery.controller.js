import { catchAsyncErr } from "../../utils/catcherr.js";
import { orderModel } from './../../../databases/models/Order.js';

export const get_orders = catchAsyncErr(async (req, res, next) => {

    const orders = await orderModel.find({ assignedDeliveryPerson: req.user._id })
    await orders.populate('assignedDeliveryPerson','name -_id')
    res.status(200).json({ "message": "success", orders });

});
export const getOneOrder = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const order = await orderModel.findOne({ _id: id, assignedDeliveryPerson: req.user._id })
    await order.populate('assignedDeliveryPerson','name -_id')
    res.status(200).json({ "message": "success", order });

});

export const deliverd = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
    let order = await orderModel.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: new Date() }, { new: true })
    await order.populate('assignedDeliveryPerson','name -_id')
    res.status(201).json({ "message": " success", order })

})


export const paid = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
    let order = await orderModel.findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
    await order.populate('assignedDeliveryPerson','name -_id')
    res.status(201).json({ "message": " success", order })

})
