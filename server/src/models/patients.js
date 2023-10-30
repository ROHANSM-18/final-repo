const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Doctor = require('./doctors');
const User = require('./users');

const Patient = sequelize.define('Patient', {
  PatientID: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  FirstName: {
    type: DataTypes.STRING(255),
  },
  LastName: {
    type: DataTypes.STRING(255),
  },
  DateOfBirth: {
    type: DataTypes.DATE,
  },
  Gender: {
    type: DataTypes.STRING(10),
  },
  ContactInformation: {
    type: DataTypes.TEXT,
  },
  UserID: { 
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  DoctorID: {
    type: DataTypes.STRING(36),
    references: {
      model: Doctor,
      key: 'DoctorID',
    },
  },
}, {
  timestamps: false,
});

module.exports = Patient;