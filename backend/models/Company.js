const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: String },
  revenue: { type: Number },
  employees: { type: Number },
  admins: { type: Number },
  logo: { type: String }, // URL for the logo
});

module.exports = mongoose.model('Company', companySchema);