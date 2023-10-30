const LabResult = require('../../models/labresults');
const Patient = require('../../models/patients');
const Doctor = require('../../models/doctors');
const VisitAppointment = require('../../models/appointments');


const getLabResultsByPatientID = async (_, { PatientID }) => {
  try {
    const labResults = await LabResult.findAll({
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
    return labResults;
  } catch (error) {
    throw new Error(`Failed to fetch lab results: ${error.message}`);
  }
};

module.exports = getLabResultsByPatientID;