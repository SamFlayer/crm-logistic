const Client = require('../db/models/client');
const Comment = require('../db/models/comment');

const renderAddClient = (req, res) => {
  res.render('clients/addNew');
};

const postAddClient = async (req, res) => {
  const manager = res.locals.id;
  const {
    name, lastname, middlename, phone, email,
  } = req.body;
  try {
    if (name && lastname && middlename && phone && email) {
      const newClient = await Client.create({
        name, lastname, middlename, phone, email, manager,
      });
      return res.redirect(`/clients/${newClient._id}`);
    }
  } catch {
    return res.status(418).redirect('/clients/new');
  }
};

const renderAllClients = async (req, res) => {
  const clients = await Client.find();
  res.render('clients/allClients', { clients });
};

const renderClient = async (req, res) => {
  const client = await Client.findById(req.params.id).populate('orders').populate({ path: 'comments', populate: { path: 'manager' } });
  res.render('clients/client', { client });
};

const findClients = async (req, res) => {
  const { lastName } = req.query;
  let allClients = []
  if (lastName) allClients = await Client.find({ lastname: new RegExp(`^${lastName}.*`, 'ig') });
  res.json(allClients);
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const newComment = new Comment({ manager: res.locals.id, text });
  await newComment.save();
  await Client.findByIdAndUpdate(id, { $push: { comments: newComment._id } });
  res.status(200).json({
    isAdmin: res.locals.admin,
    text: newComment.text,
    name: res.locals.name,
    lastname: res.locals.lastname,
    middlname: res.locals.middlname,
  });
};

const findAll = async (req, res) => {
  let { text } = req.body;
  text = text.toLowerCase();
  const clients = await Client.find();
  const result = clients.filter((client) => client.name.toLowerCase()?.includes(text)
   || client.lastname?.toLowerCase().includes(text)
   || client.middlename?.toLowerCase().includes(text));
  res.status(200).json({
    clients: result,
  });
};

const renderEditClient = async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.render('clients/editClient', { client });
};

const postEditClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, { ...req.body });
  res.redirect(`/clients/${client._id}`);
};

const deliteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.redirect('/clients');
};

module.exports = {
  renderAllClients,
  renderClient,
  findClients,
  addComment,
  renderAddClient,
  postAddClient,
  findAll,
  renderEditClient,
  postEditClient,
  deliteClient,
};
