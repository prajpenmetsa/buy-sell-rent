const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerEmail: String,
  sellerEmail: String,
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'itemdata' },
  otpHash: String,
  status: { type: String, default: "pending" }
});

const orderdataModel = mongoose.model("orderdata", orderSchema);
module.exports = orderdataModel;
