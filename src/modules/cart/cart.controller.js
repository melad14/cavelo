
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import { menuModel } from './../../../databases/models/MenuItem.js';
import { cartModel } from './../../../databases/models/cart.js';
import { coponModel } from './../../../databases/models/coupon.js';



function calctotalPrice(cart) {
    let totalPrice = 0;
    cart.cartItems.forEach(elm => {
        totalPrice += elm.quantity * elm.basePrice
    });
    cart.totalPrice = totalPrice

}

const addTocart = catchAsyncErr(async (req, res, next) => {
    let result = await menuModel.findById(req.body.item)
    if (!result) return next(new AppErr(`item not found`, 200))
    req.body.basePrice = result.basePrice

    let cartExist = await cartModel.findOne({ user: req.user._id })
    if (!cartExist) {
        let newcart = new cartModel({
            user: req.user._id,
            cartItems: [req.body]
        })

        newcart = await newcart.populate('cartItems.item')

    ;
        calctotalPrice(newcart)
        await newcart.save()
        return res.status(201).json({ "message": " success", newcart })
    }

    let find = cartExist.cartItems.find((elm) => elm.item == req.body.item)
    if (find) {
        find.quantity += 1
    } else {
        cartExist.cartItems.push(req.body)
    }
    if (cartExist.discount) {
        cartExist.totalPriceAfterDiscount = cartExist.totalPrice - (cartExist.totalPrice * cartExist.discount) / 100
    }
    cartExist= await cartExist.populate('cartItems.item')
    calctotalPrice(cartExist)
    await cartExist.save()
    
    res.status(201).json({ "message": " success", cart: cartExist })

})


const removeFromCart = catchAsyncErr(async (req, res, next) => {
    const result = await cartModel.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { _id: req.params.id } } }, { new: true })
    if (!result) return next(new AppErr(`cart not found`, 200))
    calctotalPrice(result)
    if (result.discount) {
        result.totalPriceAfterDiscount = result.totalPrice - (result.totalPrice * result.discount) / 100
    }
    res.status(200).json({ "message": " success", result })
})


const updateQuantity = catchAsyncErr(async (req, res, next) => {
    let result = await menuModel.findById(req.params.id)
    if (!result) return next(new AppErr(`item not found`, 404))
    let cartExist = await cartModel.findOne({ user: req.user._id })

    let item = cartExist.cartItems.find((elm) => elm.item == req.params.id)
    if (item) {
        item.quantity = req.body.quantity
    }
    calctotalPrice(cartExist)
    if (cartExist.discount) {
        cartExist.totalPriceAfterDiscount = cartExist.totalPrice - (cartExist.totalPrice * cartExist.discount) / 100
    }
    await cartExist.save()
    res.status(201).json({ "message": " success", cartExist })
})


const applyCoupon = catchAsyncErr(async (req, res, next) => {
    let coupon = await coponModel.findOne({ code: req.body.code, expire: { $gt: Date.now() } })
    if (!coupon) return next(new AppErr(`coupon not available`, 404))

    let cart = await cartModel.findOne({ user: req.user._id })
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
    cart.discount = coupon.discount
    await cart.save()
    res.status(201).json({ "message": " success", cart })
})



const getLoggedUserCart = catchAsyncErr(async (req, res, next) => {
    let cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.item')
    if (!cart) return next(new AppErr(`cart not found`, 200))

    res.status(201).json({ "message": " success", cart })


})

export {
    addTocart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getLoggedUserCart
}













