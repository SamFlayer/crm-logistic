/* eslint-disable max-len */
const express = require('express');
const sessions = require('express-session');
const MongoStore = require('connect-mongo');
// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');
// eslint-disable-next-line import/no-extraneous-dependencies
// const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
const { connect } = require('mongoose');
require('dotenv').config();
process.env.PWD = __dirname

const User = require('./db/models/user');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const ordersRouter = require('./routes/ordersRouter');
const clientsRouter = require('./routes/clientsRouter');

const app = express();

app.set('view engine', 'hbs');
app.set('cookieName', 'sid');
app.set('views', path.join(process.env.PWD, 'views'));
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials'));
hbs.registerHelper('witchClass', (status) => {
  switch (status) {
    case 'в работе':
      return 'table-success';
    case 'в рекламации':
      return 'table-danger';
    case 'закрыт':
      return 'table-secondary';
    default:
      return '';
  }
});

// app.use(logger('dev'));
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessions({
  name: app.get('cookieName'),
  secret: process.env.SECRET_KEY,
  resave: false, // Не сохранять сессию, если мы ее не изменим
  saveUninitialized: false, // не сохранять пустую сессию
  store: MongoStore.create({ // выбираем в качестве хранилища mongoDB
    mongoUrl: process.env.DB_CONNECTION_CLOUD,
  }),
  cookie: { // настройки, необходимые для корректного работы cookie
    httpOnly: true, // не разрещаем модифицировать данную cookie через javascript
    maxAge: 86400 * 1e3, // устанавливаем время жизни cookie
  },
}));

app.use(async (req, res, next) => {
  const userId = req.session?.user?.id;
  if (userId) {
    const currentUser = await User.findById(userId);
    if (currentUser) {
      res.locals.name = currentUser.name;
      res.locals.lastname = currentUser.lastname;
      res.locals.middlname = currentUser.middlename;
      res.locals.id = currentUser._id;
      res.locals.admin = currentUser.role === 'admin';
      res.locals.manager = currentUser.role === 'manager';
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/managers', managersRouter);
app.use('/clients', clientsRouter);
app.use('/orders', ordersRouter);

// Если HTTP-запрос дошёл до этой строчки, значит ни один из ранее встречаемых рутов не ответил на запрос.
// eslint-disable-next-line max-len
// Это значит, что искомого раздела просто нет на сайте. Для таких ситуаций используется код ошибки 404.
// Создаём небольшое middleware, которое генерирует соответствующую ошибку.
app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

// Отлавливаем HTTP-запрос с ошибкой и отправляем на него ответ.
app.use((err, req, res) => {
  // Получаем текущий ражим работы приложения.
  const appMode = req.app.get('env');
  // Создаём объект, в котором будет храниться ошибка.
  let error;

  // Если мы находимся в режиме разработки, то отправим в ответе настоящую ошибку. В противно случае отправим пустой объект.
  if (appMode === 'development') {
    error = err;
  } else {
    error = {};
  }

  // Записываем информацию об ошибке и сам объект ошибки в специальные переменные, доступные на сервере глобально, но только в рамках одного HTTP-запроса.
  res.locals.message = err.message;
  res.locals.error = error;

  // Задаём в будущем ответе статус ошибки. Берём его из объекта ошибки, если он там есть. В противно случае записываем универсальный стату ошибки на сервере - 500.
  res.status(err.status || 500);
  // Формируем HTML-текст из шаблона "error.hbs" и отправляем его на клиент в качестве ответа.
  res.render('error');
});

const PORT = process.env.PORT ?? 3000;

app.listen(
  PORT,
  () => {
    console.log(`Server started on port ${PORT}.`);

    connect(process.env.DB_CONNECTION_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }, () => {
      console.log('Connection to databse is successful.');
    });
  },
);

module.exports = app;
