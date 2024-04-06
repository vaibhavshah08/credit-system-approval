const customer_data = require('../models/customer');
const { errorHandler } = require("../utils/error");

function generateRandomId() {
  return Math.floor(10000 + Math.random() * 90000);
}
const generatedIds = new Set();
function generateUnique5DigitId() {
  let id;
  do {
      id = generateRandomId();
  } while (generatedIds.has(id));
  generatedIds.add(id);
  return id;
}

const registerCustomer = async (req, res, next ) => {
  try {
    const { first_name, last_name, age, monthly_income, phone_number } = req.body;
    const approved_limit = Math.round(36 * monthly_income / 100000) * 100000;
    const customer_ref_id = generateUnique5DigitId();
    const customer = await customer_data.create({
      customer_ref_id: customer_ref_id,
      first_name: first_name,
      last_name: last_name,
      age: age,
      phone_number: phone_number,
      approved_limit: approved_limit,
      monthly_salary: monthly_income,
    })
    res.status(201).json({
      customer_id: customer.customer_id,
      name: `${customer.first_name} ${customer.last_name}`,
      age: customer.age,
      monthly_income: customer.monthly_salary,
      approved_limit: customer.approved_limit,
      phone_number: customer.phone_number
    })
  } catch (error) {
    console.error('Error register customer: ',error);
    next(errorHandler(500, 'Internal server error'));
  }
}

module.exports = registerCustomer;
