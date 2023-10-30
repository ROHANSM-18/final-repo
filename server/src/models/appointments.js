const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Patient = require('./patients'); 
const Doctor = require('./doctors'); 




const VisitAppointment = sequelize.define('VisitAppointment', {
  VisitID: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  DateAndTime: {
    type: DataTypes.DATE,
  },
  Provider: {
    type: DataTypes.STRING(255),
  },
  ReasonForVisit: {
    type: DataTypes.TEXT,
  },
  Diagnosis: {
    type: DataTypes.TEXT,
  },
  Prescriptions: {
    type: DataTypes.TEXT,
  },
  PatientID: {
    type: DataTypes.STRING(36),
    references: {
      model: Patient,
      key: 'PatientID',
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


module.exports = VisitAppointment;