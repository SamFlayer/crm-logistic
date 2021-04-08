/* eslint-disable no-dupe-keys */
const Order = require('../db/models/order');
const Counter = require('../db/models/counter');
const User = require('../db/models/user');
const Client = require('../db/models/client');
const Comment = require('../db/models/comment');
// const { response } = require('express');

const renderAllOrders = async (req, res) => {
  const orders = await Order.find().populate('client');
  res.render('orders/allOrders', { orders });
};

const renderOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('client').populate({ path: 'comments', populate: { path: 'manager' } });
  res.render('orders/order', { order });
};

const renderNewOrderForm = (req, res) => {
  res.render('orders/addNewOrder');
};

const addNewOrder = async (req, res) => {
  try {
    const counter = await Counter.findOne();

    const newOrder = await Order.create({ ...req.body, number: counter.number });
    await Client.findByIdAndUpdate(req.body.client, { $push: { orders: newOrder._id } });
    await User.findByIdAndUpdate(res.locals.id, { $push: { orders: newOrder._id } });

    counter.number++;
    await counter.save();
    console.log(newOrder);
    res.status(200).json(newOrder._id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const newComment = new Comment({ manager: res.locals.id, text });
  await newComment.save();
  await Order.findByIdAndUpdate(id, { $push: { comments: newComment._id } });
  res.status(200).json({
    isAdmin: res.locals.admin,
    text: newComment.text,
    name: res.locals.name,
    lastname: res.locals.lastname,
    middlname: res.locals.middlname,
  });
};

const renderNewOrderFormForClient = async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.render('orders/addNewOrderForClient', { client });
};

const findAll = async (req, res) => {
  let { text } = req.body;
  text = text.toLowerCase();
  const orders = await Order.find();
  const result = orders.filter((order) => order.number === +text
    || order.title?.toLowerCase().includes(text)
    || order.status?.toLowerCase().includes(text));
  res.status(200).json({
    orders: result,
  });
};

const renderOrderEdit = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('client');
  console.log(order, 'order');
  res.render('orders/edit', { order });
};

const postEditOrder = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { ...req.body });
  const order = await Order.findById(req.params.id);
  res.redirect(`/orders/${order._id}`);
};

const deliteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.redirect('/orders');
};

const changeStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.sendStatus(200);
};

module.exports = {
  renderAllOrders,
  renderOrder,
  addNewOrder,
  addComment,
  findAll,
  renderNewOrderForm,
  addNewOrder,
  renderNewOrderFormForClient,
  renderOrderEdit,
  postEditOrder,
  deliteOrder,
  changeStatus,
};
