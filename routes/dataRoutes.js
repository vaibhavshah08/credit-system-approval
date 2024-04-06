const express = require('express');
const parseExcelData = require('../helpers/transformData');
const Customer = require('../models/customer');
const Loan = require('../models/loan');

const router = express.Router();

router.post('/ingest-data', async (req, res) => {
  try {
    const { customerData, loanData } = await parseExcelData();
    customerData.forEach(async (customer) => {
      await Customer.create({
        customer_ref_id: customer.customer_ref_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        age: customer.age,
        phone_number: customer.phone_number,
        monthly_salary: customer.monthly_salary,
        approved_limit: customer.approved_limit,
        current_debt: customer.current_debt
      });
    })
    loanData.forEach(async (loan) => {
      await Loan.create({
        customer_id: loan.customer_id,
        loan_id: loan.loan_id,
        loan_amount: loan.loan_amount,
        tenure: loan.tenure,
        interest_rate: loan.interest_rate,
        monthly_repayment: loan.monthly_repayment,
        emis_paid_on_time: loan.emis_paid_on_time,
        start_date: loan.start_date,
        end_date: loan.end_date
      })
    })
    res.status(200).send('Data ingestion process completed successfully');
  } catch (error) {
    console.error('Error ingesting data:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
