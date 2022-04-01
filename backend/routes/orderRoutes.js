import express from 'express'
import User from '../Models/userModel';
import { generateToken, isAuth } from '../utils';
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs';
import Order from '../Models/orderModel';


const orderRouter = express.Router();

orderRouter.post('/',isAuth, expressAsyncHandler(async(req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({...x, product: x._id})),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
    shippingAddress: req.body.shippingAddress,
    shippingAddress: req.body.shippingAddress,
  });

  const order = await newOrder.save();
  res.status(201).send({ message: 'New Order Created', order})
}))


export default orderRouter;
