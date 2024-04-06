const reader = require('xlsx');

async function parseExcelData() {
    const customerDataWorkbook = reader.readFile(`${__dirname}/input/customer_data.xlsx`)
    const customerDataSheet = customerDataWorkbook.Sheets[customerDataWorkbook.SheetNames[0]];
    const customerData = reader.utils.sheet_to_json(customerDataSheet);

    const loanDataWorkbook = reader.readFile(`${__dirname}/input/loan_data.xlsx`);
    const loanDataSheet = loanDataWorkbook.Sheets[loanDataWorkbook.SheetNames[0]];
    const loanData = reader.utils.sheet_to_json(loanDataSheet);

    // Checking for customer_id and loan Id, if it occurs more than one time just making it different for example 
    // 2104 for the first time will be same. and if it appears second time it will become 21042. 
    const custIdCountMap = {};
    const transformedCustomerData = customerData.map(customer => {
        const customerId = customer['Customer ID'];
        custIdCountMap[customerId] = (custIdCountMap[customerId] || 0) + 1;
        const uniqueCustomerId = custIdCountMap[customerId] > 1 ? `${customerId}${custIdCountMap[customerId]}` : customerId;
        return {
            customer_ref_id: uniqueCustomerId,
            first_name: customer['First Name'],
            last_name: customer['Last Name'],
            age: customer['Age'],
            phone_number: customer['Phone Number'],
            monthly_salary: customer['Monthly Salary'],
            approved_limit: customer['Approved Limit'],
            current_debt: customer['Current Debt']
        };
    });

    const loanIdCountMap = {};
    const transformedLoanData = loanData.map(loan => {
        const loanId = loan['Loan ID'];
        loanIdCountMap[loanId] = (loanIdCountMap[loanId] || 0) + 1;
        const uniqueLoanId = loanIdCountMap[loanId] > 1 ? `${loanId}${loanIdCountMap[loanId]}` : loanId;
        return {
            customer_id: loan['Customer ID'],
            loan_id: uniqueLoanId,
            loan_amount: loan['Loan Amount'],
            tenure: loan['Tenure'],
            interest_rate: loan['Interest Rate'],
            monthly_repayment: loan['Monthly payment'],
            emis_paid_on_time: loan['EMIs paid on Time'],
            start_date: loan['Date of Approval'],
            end_date: loan['End Date']
        };
    });
    

    return { customerData: transformedCustomerData, loanData: transformedLoanData };
}

module.exports = parseExcelData;
