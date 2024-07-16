import { cartModel } from "../../../databases/models/cart.js"
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js"
import { orderModel } from './../../../databases/models/Order.js';
import { notificationModel } from './../../../databases/models/notifcation.js';
import Pusher from 'pusher';
import { dirname } from 'path';
import pdf from "pdf-creator-node";
import { readFileSync } from "fs";
import path from "path";
import { options } from "../../utils/option.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pusher = new Pusher({
    appId: "1832769",
    key: "74fa23b5f9fdd3fa37f0",
    secret: "c59f35157bcebbfb400a",
    cluster: "eu",
    useTLS: true
  });

  
  export const createPdf = async (orderId) => {
    try {
        const order = await orderModel.findById(orderId).populate('cartItems.item');
     
        const items = order.cartItems.map(item => ({
            name: item.item.name,
            quantity: item.quantity, // Ensure quantity is included
            basePrice: item.item.basePrice
        }));
        const html = readFileSync(path.resolve(__dirname, "../../templates/pdf.html"), "utf8");
        const filename = `invoice_${order._id}.pdf`;
        const document = {
            html: html,
            data: {
                cartItems:items,
                totalOrderPrice: order.totalOrderPrice
            },
            path:path.resolve(__dirname, "../../docs/", filename),
            type: "",
        };

        await pdf.create(document, options);
        return document.path;
    } catch (error) {
        console.log(error);
        throw new AppErr('PDF creation failed', 500);
    }
};

const ctreateCashOrder = catchAsyncErr(async (req, res, next) => {
    const cart = await cartModel.findById(req.params.id);
    if (!cart) return next(new AppErr('cart not found', 404));
    
    req.body.user = req.user._id;
    req.body.cartItems = cart.cartItems;
    req.body.totalOrderPrice = cart.totalPriceAfterDiscount;
    
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
        
        // Generate PDF Invoice
        const pdfPath = await createPdf(order._id);
        
          res.status(200).json({ "message": "success", "statusCode": 200, order, pdfPath });
    } else {
        return next(new AppErr('order not created', 400));
    }
});


const getSpecificorders = catchAsyncErr(async (req, res, next) => {
    
    let orders = await orderModel.find({ user: req.user._id })
    .select('-cartItems -shippingAddress -user -tableNumber');

    res.status(200).json({ "message": " success","statusCode":200, orders })

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
   await orderModel.findByIdAndUpdate(id, { isDelivered: true, deliveredAt: new Date() }, { new: true })

    res.status(200).json({ "message": " success","statusCode":200 })

})
const paid = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
   await orderModel.findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
   
    res.status(200).json({ "message": " success","statusCode":200 })

})

const cancel = catchAsyncErr(async (req, res, next) => {

    const { id } = req.params
    await orderModel.findByIdAndUpdate(id, { cancel: true}, { new: true })
    res.status(200).json({ "message": " success","statusCode":200 })

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
    ctreateCashOrder,cancel,
    getSpecificorders,
    getAllorders, completeDelivry, completeInDoor,
    paid, deliverd, AdminGetOrder,userGetOrder,userGetOrderHistory


}

