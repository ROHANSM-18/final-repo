const MedicalHistory = require('../../models/medicalhistories');
const Patient = require('../../models/patients');

const updateMedicalHistory = async (_, { input }) => {
  const { MedicalHistoryID, Conditions, Surgeries, Allergies, Medications, PatientID } = input;

  try {
    const medicalHistory = await MedicalHistory.findByPk(MedicalHistoryID);

    if (!medicalHistory) {
      throw new Error('Medical history not found');
    }

    // Note: I'm assuming that the MedicalHistory model has a 'PatientID' field.
    if (PatientID) {
      const patient = await Patient.findOne({ where: { PatientID } });
      if (!patient) {
        throw new Error('Patient not found');
      }
      medicalHistory.PatientID = patient.PatientID;
    }

    if (Conditions) {
      medicalHistory.Conditions = Conditions;
    }
    if (Surgeries) {
      medicalHistory.Surgeries = Surgeries;
    }
    if (Allergies) {
      medicalHistory.Allergies = Allergies;
    }
    if (Medications) {
      medicalHistory.Medications = Medications;
    }

    await medicalHistory.save();
    return { ...medicalHistory.get() };
  } catch (error) {
    throw new Error(`Failed to update medical history: ${error.message}`);
  }
};

module.exports = updateMedicalHistory;
