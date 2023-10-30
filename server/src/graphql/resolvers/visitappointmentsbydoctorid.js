const VisitAppointment = require('../../models/appointments');
const Doctor = require('../../models/doctors');
const LabResult = require('../../models/labresults');
const Vital = require('../../models/vitals');
const Patient = require('../../models/patients');

const getVisitAppointmentsByDoctorID = async (_, { DoctorID }) => {
  try {
    const visitAppointments = await VisitAppointment.findAll({
      where: { DoctorID },
      include: [
        {
          model: Doctor,
        },
        {
          model: LabResult,
        },
        {
          model: Vital,
        },
        {
            model: Patient,
          },
      ],
    });
    return visitAppointments;
  } catch (error) {
    throw new Error(`Failed to fetch visit appointments by doctor ID: ${error.message}`);
  }
};

module.exports = getVisitAppointmentsByDoctorID;
