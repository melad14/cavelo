process.on('uncaughtException', (err) => {
    console.log(err);
})

import express from 'express'
import { conn } from './databases/dbConnection/db.connection.js'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import { AppErr } from './src/utils/AppErr.js';
import { globalErr } from './src/middleware/globalErr.js';
import cors from "cors"

import userRouter from './src/modules/users/user.router.js';
import menuRouter from './src/modules/menu/menu.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import orderRouter from './src/modules/order/order.router.js';
import cartRouter from './src/modules/cart/cart.router.js';
import couponRouter from './src/modules/coupon/coupon.router.js';
import reviewRouter from './src/modules/review/review.router.js';
import tableRouter from './src/modules/reservation/reservation.router.js';
import notificationRouter from './src/modules/notification/notification.route.js';
import adminRouter from './src/modules/admin-auth/admin.router.js';
import addressRouter from './src/modules/adresses/address.router.js';
import deliveryRouter from './src/modules/delivery/delivery.router.js';
import scheduleRouter from './src/modules/schedule/schedule.router.js';
import sliderRouter from './src/modules/slider/slider.router.js';


const app = express()
const port = 3000

dotenv.config()
mongoose.set('strictQuery', true);

app.use(cors())

app.use(express.json())



app.use('/api/v1/auth', userRouter);
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/tables', tableRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/delivery', deliveryRouter);
app.use('/api/v1/schedule', scheduleRouter);
app.use('/api/v1/slider', sliderRouter);

app.all('*', (req, res, next) => {
    next(new AppErr("this route not found", 404))
});



app.use(globalErr)

conn();

app.listen(process.env.PORT || port, () => console.log(`runing.....`))

process.on('unhandledRejection', (err) => {
    console.log(err);
})