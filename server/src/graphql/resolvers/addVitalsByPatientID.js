const Vital = require('../../models/vitals');
const Patient = require('../../models/patients');
const Doctor = require('../../models/doctors');
const VisitAppointment = require('../../models/appointments');

const addVitalsByPatientID = async (_, { input }) => {
  try {
    // Find the patient and doctor by their IDs
    const patient = await Patient.findByPk(input.PatientID);
    const doctor = await Doctor.findByPk(input.DoctorID);
    if (!patient || !doctor) {
      throw new Error(`Patient or Doctor not found for provided IDs.`);
    }

    // Create the new vitals record and include the associations
    const newVitals = await Vital.create({
      BloodPressure: input.BloodPressure,
      HeartRate: input.HeartRate,
      RespiratoryRate: input.RespiratoryRate,
      Temperature: input.Temperature,
      OxygenSaturation: input.OxygenSaturation,
      Patient: patient, // Include the associated Patient
      Doctor: doctor,  
      VitalID: input.VitalID
    });

    // Return the newly created vitals record
    return newVitals;
  } catch (error) {
    throw new Error(`Failed to add new vitals: ${error.message}`);
  }
};

module.exports = addVitalsByPatientID;
