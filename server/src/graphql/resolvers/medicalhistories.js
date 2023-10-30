const MedicalHistory = require('../../models/medicalhistories');
const Patient = require('../../models/patients');


const getMedicalHistoryByPatientID = async (_, { PatientID }) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      where: { PatientID },
      include: [
        {
          model: Patient,
        },
      ],
    });
    return medicalHistory;
  } catch (error) {
    throw new Error(`Failed to fetch medical history: ${error.message}`);
  }
};

module.exports = getMedicalHistoryByPatientID;