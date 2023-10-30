const Doctor = require('../../models/doctors')
const Patient = require('../../models/patients')
const User = require('../../models/users')


const getAllPatients = async () => {
  try {
    const patients = await Patient.findAll({
      include: [Doctor, User],
    });
    return patients;
    } catch (error) {
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }
};

module.exports = getAllPatients;