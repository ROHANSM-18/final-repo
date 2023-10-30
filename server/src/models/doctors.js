const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const User = require('../models/users');

const Doctor = sequelize.define('Doctor', {
  DoctorID: {
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
  UserID: { 
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  ContactInformation: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: false,
});



module.exports = Doctor;