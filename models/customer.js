const { DataTypes } = require('sequelize');
const db = require('../db');

const customer_data = db.define(
  "customer_data",
  {
    customer_id: {
      type:  DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    customer_ref_id: {
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    phone_number: {
        type: DataTypes.BIGINT,
    },
    monthly_salary: {
        type: DataTypes.INTEGER,
    },
    approved_limit: {
        type: DataTypes.INTEGER,
    },
    current_debt: {
        type: DataTypes.INTEGER,
    }
  }
);

db.sync();
module.exports = customer_data;