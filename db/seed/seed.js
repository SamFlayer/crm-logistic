const { connect, connection } = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Counter = require('../models/counter');

//const Client = require('../models/client');
require('dotenv').config();

async function main() {
  await connect(process.env.DB_CONNECTION_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  await User.create({ email: 'q@q', role: 'admin', password: await bcrypt.hash('1', 10) });
  
  await Counter.create({number: 1});

  await connection.close();
}
main();
