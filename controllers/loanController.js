const loan_data = require('../models/loan');
const customer_data = require('../models/customer');
const errorHandler = require("../utils/error");
const {
  isLoanApproved,
  generateUnique5DigitId
} = require('../helpers/loanHelper');

const viewloanDetails = async (req, res, next) => {
  try {
    const { loan_id } = req.params;

    const loan = await loan_data.findOne({where: { loan_id: loan_id }});
    if (!loan) {
      return next(errorHandler(404, 'Loan not found'));
    }
    const customer = await customer_data.findOne({where: {customer_id: loan.customer_id}});
    const response = {
      loan_id: loan.loan_id,
      customer: {
        id: customer.customer_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        age: customer.age
      },
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      is_loan_approved: loan.is_approved,
      monthly_installment: loan.monthly_repayment,
      tenure: loan.tenure
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching loan details:", error);
    next(errorHandler(500, "Internal server error"));
  }
}

const viewStatement = async (req, res, next) => {
  try {
    const { customer_id, loan_id } = req.params;
    const loan = await loan_data.findOne({where: { loan_id: loan_id }});
    if (!loan) {
      return next(errorHandler(404, 'Loan not found'));
    }
    if(loan.customer_id != customer_id){
      return next(errorHandler(400, 'Loan and Customer details not matched please verify'));
    }
    const customer = await customer_data.findOne({where: {customer_id: customer_id}});
    if (!customer) {
      return next(errorHandler(404, 'Customer not found'));
    }
    const loanStatement = {
      customer_id: customer.customer_ref_id,
      loan_id: loan.loan_id,
      principal: loan.loan_amount,
      interest_rate: loan.interest_rate,
      amount_paid: loan.amount_paid,
      monthly_installment: loan.monthly_repayment,
      repayments_left: loan.tenure - loan.emis_paid_on_time
    };
    res.status(200).json(loanStatement);
  } catch (error) {
    console.error("Error fetching details:", error);
    next(errorHandler(500, "Internal server error"));
  }
}

const makePayment = async (req, res, next) => {
  try {
    const { customer_id, loan_id } = req.params;
    const { amount_paid } = req.body;

    const loan = await loan_data.findOne({ where: { loan_id, customer_id } });
    if (!loan) {
      return next(errorHandler(404, 'Loan not found'));
    }
    if(loan.customer_id != customer_id){
      return next(errorHandler(400, 'Loan and Customer details not matched please verify'));
    }
    const customer = await customer_data.findOne({ where: { customer_id } });
    if (!customer) {
      return next(errorHandler(404, 'Customer not found'));
    }
    const remainingAmount = loan.monthly_repayment - loan.amount_paid;
    if (amount_paid > remainingAmount) {
      return next(errorHandler(400, 'Amount paid cannot be more than the remaining amount'));
    }
    loan.amount_paid += amount_paid;
    await loan.save();
    res.status(200).json({ message: 'Payment made successfully' });
  } catch (error) {
    console.error('Error making payment:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

const checkEligibility = async (req, res, next) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    const customer = await customer_data.findOne({ where: { customer_id: customer_id } });
    if (!customer) {
      return next(errorHandler(404, 'Customer not found'));
    }
    const loans = await loan_data.findAll({ where: { customer_id: customer_id } });
    let { approval, corrected_interest_rate } = isLoanApproved(customer,loans,interest_rate,loan_amount);
    const monthlyInterestRate = corrected_interest_rate/1200;
    const monthly_installment = (loan_amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenure));
    const result = {
      customer_id: customer_id,
      approval: approval,
      interest_rate: interest_rate,
      corrected_interest_rate: corrected_interest_rate,
      tenure: tenure,
      monthly_installment: monthly_installment
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking eligibility:', error);
    next(errorHandler(500, 'Internal server error'));
  }
}

const createLoan = async (req, res, next) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    const customer = await customer_data.findOne({ where: { customer_id: customer_id } });
    if (!customer) {
      return next(errorHandler(404, 'Customer not found'));
    }
    const loans = await loan_data.findAll({ where: { customer_id: customer_id } });
    let { approval, corrected_interest_rate } = isLoanApproved(customer,loans,interest_rate,loan_amount);
    const monthlyInterestRate = corrected_interest_rate/1200;
    const monthly_installment = (loan_amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenure));
    const result = {
      customer_id: customer_id,
      approval: approval,
      interest_rate: interest_rate,
      corrected_interest_rate: corrected_interest_rate,
      tenure: tenure,
      monthly_installment: parseInt(monthly_installment)
    }
    if (approval === true) {
      const loan_id = generateUnique5DigitId();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + tenure);
      const savedLoan = await loan_data.create(
        {
          customer_id: customer_id,
          loan_id: loan_id,
          loan_amount: loan_amount,
          tenure: tenure,
          interest_rate: corrected_interest_rate,
          monthly_repayment: parseInt(monthly_installment),
          emis_paid_on_time: 0,
          start_date: startDate,
          end_date: endDate
        }
      );
      res.status(201).json(savedLoan);
    }
    else {
      result.message = 'Loan cannot be approved due to credit score or eligibility issues.';
      res.status(202).json(result);
    }
  } catch (error) {
    console.error('Error creating loan:', error);
    next(errorHandler(500, 'Internal server error'));
  }
}

module.exports =  { 
  viewloanDetails,
  viewStatement,
  makePayment,
  checkEligibility,
  createLoan
};