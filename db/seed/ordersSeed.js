const { connect, connection } = require('mongoose');
const Order = require('../models/order');
require('dotenv').config();

async function main() {
  await connect(process.env.DB_CONNECTION_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const orders = [
    new Order({
      title: 'Кровать',
      number: 12,
      deliveryadress: 'Липовый парк, д.9',
      deliverydate: new Date(),
      assemblydate: new Date(),
      orderprice: 50000,
      payment: 20000,
      deliveryprice: 2000,
      assemblyprice: 1000,
    }),
    new Order({
      title: 'Шкаф-купе',
      number: 10,
      deliveryadress: 'Орджоникидзе ул., 11с10',
      deliverydate: new Date(),
      assemblydate: new Date(),
      orderprice: 150000,
      payment: 20000,
      deliveryprice: 2000,
      assemblyprice: 1000,
    }),
    new Order({
      title: 'мебель',
      number: 19,
      deliveryadress: 'Улица, дом',
      deliverydate: new Date(),
      assemblydate: new Date(),
      orderprice: 50000,
      status: 'в рекламации',
      payment: 20000,
      deliveryprice: 2000,
      assemblyprice: 1000,
    }),
    new Order({
      title: 'Кухня',
      number: 12,
      deliveryadress: 'Улица, дом',
      deliverydate: new Date(),
      assemblydate: new Date(),
      orderprice: 350000,
      payment: 20000,
      deliveryprice: 2000,
      assemblyprice: 1000,
      status: 'закрыт',
    }),
    new Order({
      title: 'Компьютерный стол',
      number: 12,
      deliveryadress: 'Липовый парк, д.9',
      deliverydate: new Date(),
      assemblydate: new Date(),
      orderprice: 20000,
      payment: 20000,
      deliveryprice: 2000,
      assemblyprice: 1000,
    }),
  ];
  await Order.insertMany(orders);

  await connection.close();
}

main();
