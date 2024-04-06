const express = require('express');
const { 
  viewloanDetails,
  viewStatement,
  makePayment,
  checkEligibility, 
  createLoan
} = require('../controllers/loanController');


const router = express.Router();

router.get('/view-loan/:loan_id',viewloanDetails);
router.get('/view-statement/:customer_id/:loan_id',viewStatement);
router.post('/make-payment/:customer_id/:loan_id',makePayment);
router.get('/check-eligibility',checkEligibility);
router.post('/create-loan',createLoan);

module.exports = router;