const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    // required: true,
  },
});

module.exports = model('Comment', commentSchema);
