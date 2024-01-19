const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  category: { type: String },
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
