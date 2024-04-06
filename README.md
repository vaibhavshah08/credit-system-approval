**Welcome to Credit Approval System**

This application is built using technologies like Node.js, Express.js, Sequelize, PostgreSQL, and Docker containers. This application runs via a Docker container. 
To set up and use this application, follow the steps below:

1. Clone this repository and navigate to the root folder.
2. Run the following command to start the application in dev mode:
   ```
   docker-compose up --build
   ```
   If you encounter any issues regarding the database (e.g., database not found), please create a database named `creditsystemapp` using pgAdmin (connection details can be found in the docker-compose file).

After starting the application, you can use it. If you want to add some sample data to the database, use the following API to ingest the data:

- **API Endpoint**: `[GET] http://localhost:3000/api/ingest-data`

**Base URL**: `http://localhost:3000/api`

2. **Register a customer**:
   - **Method**: POST
   - **URL**: `{baseurl}/register`
   - **Request Body**:
     ```json
     {
         "first_name": "string",
         "last_name": "string",
         "age": "integer",
         "monthly_income": "number",
         "phone_number": "string"
     }
     ```

3. **View loan details**:
   - **Method**: GET
   - **URL**: `{baseurl}/view-loan/:loan_id`
   - **Request URL Parameter**: `loan_id` (Integer)

4. **View statement of a particular loan**:
   - **Method**: GET
   - **URL**: `{baseurl}/view-statement/:customer_id/:loan_id`
   - **Request URL Parameters**:
     - `customer_id` (Integer): Id of the applicant of the loan
     - `loan_id` (Integer): Id of approved loan

5. **Make a payment towards an EMI**:
   - **Method**: POST
   - **URL**: `{baseurl}/make-payment/:customer_id/:loan_id`
   - **Request URL Parameters**:
     - `customer_id` (Integer): Id of the applicant of the loan
     - `loan_id` (Integer): Id of approved loan
   - **Request Body**:
     ```json
     {
         "amount_paid": "number"
     }
     ```

6. **Check loan eligibility**:
   - **Method**: POST
   - **URL**: `{baseurl}/check-eligibility`
   - **Request Body**:
     ```json
     {
         "customer_id": "integer",
         "loan_amount": "number",
         "interest_rate": "number",
         "tenure": "integer"
     }
     ```

These are the endpoints available in the Credit Approval System application. Use the provided base URL and endpoint details to interact with the application.

If you are encountering any issues please let me know!!!
