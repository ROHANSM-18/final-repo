const getAllPatients = require('./patients');
const getAllDoctors = require('./doctors');
const getVisitAppointmentsByPatientID = require('./appointments');
const getMedicalHistoryByPatientID = require('./medicalhistories');
const getLabResultsByPatientID = require('./labresults');
const getVitalsByPatientID = require('./vitals');
const authResolvers = require('./authresolvers');
const getPatientByUserId = require('./getpatientdata');
const getDoctorByUserId = require('./getdoctordata');
const addDoctorToPatient = require('./addDoctorToPatient');
const updateMedicalHistory = require('./updatemedicalhistory');
//const addMedicalHistory = require('./addmedicalhistory');
const getVisitAppointmentsByDoctorID= require('./visitappointmentsbydoctorid');
const createVisitAppointment = require('./addnewappointment');
const updateVisitAppointment = require('./updatenewappointment');
const addVitalsByPatientID = require('./addVitalsByPatientID');
const resolvers = {
  
  Query: {
    getAllPatients,
    getAllDoctors,
    getVisitAppointmentsByPatientID,
    getMedicalHistoryByPatientID,
    getLabResultsByPatientID,
    getVitalsByPatientID,
    getPatientByUserId,
    getDoctorByUserId,
    getVisitAppointmentsByDoctorID
  },
  Mutation: {
    ...authResolvers,
    addDoctorToPatient,
    updateMedicalHistory,
//    addMedicalHistory
createVisitAppointment,
updateVisitAppointment,
addVitalsByPatientID
  },
};

module.exports = resolvers;