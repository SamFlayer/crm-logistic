const { connect, connection } = require('mongoose');
const Client = require('../models/client');
require('dotenv').config();

async function main() {
  await connect(process.env.DB_CONNECTION_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const clients = [
    new Client({
      name: 'Irina',
      lastname: 'Kisil',
      middlename: 'Sergeevna',
      phone: 89199606120,
      email: 'q@q',
      orders: ['6053553dd13fe8529ea73eda'],
    }),
    new Client({
      name: 'Ульяна',
      lastname: 'Кутлунина',
      middlename: 'Руслановна',
      phone: 5544614984,
      email: 'k@k',
      orders: ['6053553dd13fe8529ea73edc', '6053553dd13fe8529ea73edb'],
    }),
    new Client({
      name: 'Илья',
      lastname: 'Мельников',
      middlename: 'Максимович',
      phone: 891606120,
      email: 'q@q',
      orders: ['6053553dd13fe8529ea73ede'],
    }),
    new Client({
      name: 'Герман',
      lastname: 'Александров',
      middlename: 'Александрович',
      phone: 15841874,
      email: 'q@q',
      orders: ['6053553dd13fe8529ea73edc'],

    }),
    new Client({
      name: 'Андрей',
      lastname: 'Макар',
      phone: 6516874153,
      email: 'q@q',
      orders: ['6053553dd13fe8529ea73edd'],
    }),
  ];
  await Client.insertMany(clients);

  await connection.close();
}

main();
