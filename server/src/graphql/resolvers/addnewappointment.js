const VisitAppointment = require('../../models/appointments');

const createVisitAppointment = async (_, { input }) => {
  try {
    const visitAppointment = await VisitAppointment.create(input);
    return visitAppointment;
  } catch (error) {
    throw new Error(`Failed to create visit appointment: ${error.message}`);
  }
};

module.exports = createVisitAppointment;
