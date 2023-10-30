const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Patient = require('./patients'); // Import the Patient model if not already imported

const MedicalHistory = sequelize.define('MedicalHistory', {
  MedicalHistoryID: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  Conditions: {
    type: DataTypes.TEXT,
  },
  Surgeries: {
    type: DataTypes.TEXT,
  },
  Allergies: {
    type: DataTypes.TEXT,
  },
  Medications: {
    type: DataTypes.TEXT,
  },
  PatientID: {
    type: DataTypes.STRING(36),
    references: {
      model: Patient,
      key: 'PatientID',
    },
  },
}, {
  timestamps: false,
});



module.exports = MedicalHistory;