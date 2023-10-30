// const MedicalHistory = require('../../models/medicalhistories');
// const Patient = require('../../models/patients');

// const addMedicalHistory = async (_, { input }) => {
//   const { Conditions, Surgeries, Allergies, Medications, PatientID } = input;

//   try {
//     // Create a new medical history instance without setting 'MedicalHistoryID'
//     const newMedicalHistory = {
//       Conditions,
//       Surgeries,
//       Allergies,
//       Medications,
//     };

//     // Check if the Patient with the provided ID exists
//     const patient = await Patient.findOne({ where: { PatientID } });

//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     // Set the relationship between the patient and the medical history
//     newMedicalHistory.Patient = patient;

//     // Create and save the new medical history
//     const createdMedicalHistory = await MedicalHistory.create(newMedicalHistory);

//     return { ...createdMedicalHistory.get() };
//   } catch (error) {
//     throw new Error(`Failed to add medical history: ${error.message}`);
//   }
// };

// module.exports = addMedicalHistory;
