const Vital = require('../../models/vitals');
const Patient = require('../../models/patients');
const Doctor = require('../../models/doctors');
const VisitAppointment = require('../../models/appointments');


const getVitalsByPatientID = async (_, { PatientID }) => {
  try {
    const vitals = await Vital.findAll({
      where: { PatientID },
      include: [
        {
          model: Patient,
        },
        {
          model: Doctor,
        },
        {
          model: VisitAppointment,
        },
      ],
    });
    return vitals;
  } catch (error) {
    throw new Error(`Failed to fetch vitals: ${error.message}`);
  }
};

module.exports = getVitalsByPatientID;