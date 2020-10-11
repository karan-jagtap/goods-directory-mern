const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GoodsModel = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('goods', GoodsModel);