const VisitAppointment = require('../../models/appointments');
const Patient = require('../../models/patients');
const Doctor = require('../../models/doctors');
const LabResult = require('../../models/doctors');
const Vital = require('../../models/vitals');


const getVisitAppointmentsByPatientID = async (_, { PatientID }) => {
  try {
    const visitAppointments = await VisitAppointment.findAll({
      where: { PatientID },
      include: [
        {
          model: Patient,
        },
        {
          model: Doctor,
        },
        {
          model: LabResult,
        },
        {
          model: Vital,
        },
      ],
    });
    return visitAppointments;
  } catch (error) {
    throw new Error(`Failed to fetch visit appointments: ${error.message}`);
  }
};


module.exports = getVisitAppointmentsByPatientID;

