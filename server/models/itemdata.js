const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  price: String,
  sellerid: String,
  categories: [String]
});

const itemdataModel = mongoose.model('itemdata', itemSchema);
module.exports = itemdataModel;
