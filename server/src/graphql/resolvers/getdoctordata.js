const User = require('../../models/users');
const Doctor = require('../../models/doctors');

const getDoctorByUserId = async (_, { id }) => {
  try {
    console.log('Incoming userId:', id);

    const user = await User.findByPk(id);
    if (!user || user.role !== 'doctor') {
      throw new Error('User not found or is not a doctor.');
    }

    const doctor = await Doctor.findOne({ where: { UserID: user.id } });
    doctor.UserID = user;
    return doctor;
  } catch (error) {
    throw error;
  }
};

module.exports = getDoctorByUserId;
