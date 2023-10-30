const User = require('../../models/users');
const Patient = require('../../models/patients');

const getPatientByUserId = async (_, { id}) => {
  try {
    console.log('Incoming userId:', id);

    const user = await User.findByPk(id);
    if (!user || user.role !== 'patient') {
      throw new Error('User not found or is not a patient.');
    }

    const patient = await Patient.findOne({ where: { UserID: user.id } });
    patient.UserID = user;
    return patient;
  } catch (error) {
    throw error;
  }
};

module.exports = getPatientByUserId;
