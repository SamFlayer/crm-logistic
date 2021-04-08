/* eslint-disable max-len */
const clientsRouter = require('express').Router();
const { checkAdmin } = require('../middlewares/checkAdmin');
const { checkAuth } = require('../middlewares/checkAuth');
const {
  findAll, renderClient, renderAllClients, findClients, renderAddClient, postAddClient, addComment, renderEditClient, postEditClient, deliteClient,
} = require('../controllers/clientController');

clientsRouter.route('/')
  .get(checkAuth, renderAllClients);

clientsRouter.route('/new')
  .get(checkAuth, renderAddClient);

clientsRouter.route('/new')
  .post(checkAuth, postAddClient);

clientsRouter.route('/edit/:id')
  .get(checkAuth, renderEditClient);

clientsRouter.route('/edit/:id')
  .post(checkAuth, postEditClient);

clientsRouter.route('/delete/:id')
  .get(checkAdmin, deliteClient);

clientsRouter.route('/all/')
  .post(checkAuth, findAll)
  .get(findClients);

clientsRouter.route('/:id')
  .get(checkAuth, renderClient);

clientsRouter.route('/:id/comments')
  .post(checkAuth, addComment);

module.exports = clientsRouter;
