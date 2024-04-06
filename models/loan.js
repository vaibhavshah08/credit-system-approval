const { DataTypes } = require('sequelize');
const db = require('../db');

const loan_data = db.define(
  "loan_data",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'customer_data',
        key: 'customer_id',
      }
    },
    loan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    loan_amount: {
        type: DataTypes.INTEGER,
    },
    tenure: {
        type: DataTypes.INTEGER,
    },
    interest_rate: {
        type: DataTypes.DECIMAL,
    },
    monthly_repayment: {
        type: DataTypes.INTEGER,
    },
    emis_paid_on_time: {
        type: DataTypes.INTEGER,
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    }  
  }
);

db.sync();
module.exports = loan_data;