
function calculateCreditScore(customer, loans) {
  let score = 0;
  const pastLoansPaidOnTime = calculatePastLoansPaidOnTime(loans);
  if (pastLoansPaidOnTime >= 80) {
      score += 30;
  } else if (pastLoansPaidOnTime >= 60) {
      score += 20;
  } else if (pastLoansPaidOnTime >= 40) {
      score += 10;
  }
  const numberOfLoans = loans.length;
  if (numberOfLoans <= 1) {
      score += 20;
  } else if (numberOfLoans <= 3) {
      score += 10;
  }
  const loanActivityCurrentYear = calculateLoanActivityCurrentYear(loans);
  if (loanActivityCurrentYear >= 65) {
      score += 20;
  } else if (loanActivityCurrentYear >= 50) {
      score += 10;
  }
  const loanApprovedVolume = calculateLoanApprovedVolume(loans);
  if (loanApprovedVolume >= 700000) {
      score += 20;
  } else if (loanApprovedVolume >= 500000) {
      score += 10;
  }
  const sumOfCurrentLoans = loans.reduce((total, loan) => total + loan.loan_amount, 0);
  if (sumOfCurrentLoans > customer.approved_limit) {
      score = 0;
  }
  
  return score;
}

function calculatePastLoansPaidOnTime(loans) {
  if (loans.length === 0) {
      return 100;
  }
  const totalLoans = loans.length;
  const paidOnTimeLoans = loans.filter(loan => loan.emis_paid_on_time === loan.tenure).length;
  return (paidOnTimeLoans / totalLoans) * 100;
}

function calculateLoanActivityCurrentYear(loans) {
  if (loans.length === 0) {
    return 100;
  }
  const currentYear = new Date().getFullYear();
  const currentYearLoans = loans.filter(loan => new Date(loan.start_date).getFullYear() === currentYear);
  const totalLoans = currentYearLoans.length;
  const activeLoans = currentYearLoans.filter(loan => loan.emis_paid_on_time !== loan.tenure).length;
  return (activeLoans / totalLoans) * 100;
}
function calculateLoanApprovedVolume(loans) {
  const totalApprovedVolume = loans.reduce((total, loan) => total + loan.loan_amount, 0);
  return totalApprovedVolume;
}

function calculateSumOfEMIs(loans) {
  let sumOfEMIs = 0;
  for (const loan of loans) {
      const remainingEMIs = loan.tenure - loan.emis_paid_on_time;
      const remainingEMIAmount = remainingEMIs * loan.monthly_repayment;
      sumOfEMIs += remainingEMIAmount;
  }
  return sumOfEMIs;
}

function isLoanApproved(customer, loans, interest_rate, loan_amount) {
  let approval;
  let corrected_interest_rate = interest_rate;
  let creditScore = calculateCreditScore(customer, loans);
    if (creditScore > 50) {
      approval = true;
    } else if(creditScore > 30 && creditScore < 50 && interest_rate < 12) {
      approval = true;
      corrected_interest_rate = 12;
    } else if(creditScore > 10 && creditScore < 30 && interest_rate < 16) {
      approval = true;
      corrected_interest_rate = 16;
    } else {
      approval = false;
    }
    
    if(loan_amount>customer.approved_limit) {
      approval = false;
    }
    const sumofEMI = calculateSumOfEMIs(loans);
    if(sumofEMI > customer.monthly_salary/2){
      approval = false;
    }
    return {
      approval: approval,
      corrected_interest_rate: corrected_interest_rate

    };
}

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


module.exports = {
  isLoanApproved,
  generateUnique5DigitId
};