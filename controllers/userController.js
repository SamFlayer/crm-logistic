const bcrypt = require('bcrypt');
const User = require('../db/models/user');
const app = require('../app');

const saltRound = 10;

const userLoginRender = async (req, res) => {
  const { id } = res.locals;
  const userId = await User.findById(id);
  console.log(userId, 'userId');
  res.render('user/login', { userId });
};

const userAdminRender = (req, res) => res.render('user/adminPanel');

const userRegister = async (req, res) => {
  const {
    name,
    lastname,
    middlename,
    phone,
    email,
    password,
    role,
  } = req.body;
  if (email && password && name && lastname && middlename && phone && role) {
    const pass = await bcrypt.hash(password, saltRound);
    const newUser = await User.create({
      name,
      lastname,
      middlename,
      phone,
      email,
      password: pass,
      role,
    });

    req.session.user = {
      id: newUser._id,
    };

    return res.redirect('/');
  }
  return res.status(418).redirect('/users/adminPanel');
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const currentUser = await User.findOne({ email });
    console.log(currentUser, 'currentUser');
    if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
      req.session.user = {
        id: currentUser._id,
      };

      return res.redirect('/');
    }
    return res.status(418).redirect('/users/login');
  }
  return res.status(418).redirect('/users/login');
};

const userLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect('/');

    res.clearCookie(app.get('cookieName'));
    return res.redirect('/');
  });
};

module.exports = {
  userLoginRender,
  userRegister,
  userLogin,
  userLogout,
  userAdminRender,
};
