const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Patient = require('./patients'); 
const Doctor = require('./doctors'); 
const VisitAppointment = require('./appointments'); 

const LabResult = sequelize.define('LabResult', {
  ResultID: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  TestName: {
    type: DataTypes.STRING(255),
  },
  TestDate: {
    type: DataTypes.DATE,
  },
  TestResults: {
    type: DataTypes.TEXT,
  },
  VisitID: {
    type: DataTypes.STRING(36),
    references: {
      model: VisitAppointment,
      key: 'VisitID',
    },
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


module.exports = LabResult;