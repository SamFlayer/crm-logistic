const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    default: 'в работе',
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  deliveryadress: {
    type: String,
    required: true,
  },
  deliverydate: {
    type: Date,
    required: true,
  },
  assemblydate: {
    type: Date,
    required: true,
  },
  orderprice: {
    type: Number,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  deliveryprice: {
    type: Number,
    required: true,
  },
  assemblyprice: {
    type: Number,
    required: true,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: Date,
},
{ timestamps: true });

module.exports = model('Order', orderSchema);
