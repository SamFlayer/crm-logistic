const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
  number: {
    type: Number,
  },
});

module.exports = model('Counter', counterSchema);
