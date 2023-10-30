const VisitAppointment = require('../../models/appointments');

const updateVisitAppointment = async (_, { VisitID, input }) => {
  try {
    const [updatedRows] = await VisitAppointment.update(input, {
      where: { VisitID },
    });

    if (updatedRows === 0) {
      throw new Error('Visit appointment not found or not updated.');
    }

    const updatedAppointment = await VisitAppointment.findOne({
      where: { VisitID },
    });

    return updatedAppointment;
  } catch (error) {
    throw new Error(`Failed to update visit appointment: ${error.message}`);
  }
};

module.exports = updateVisitAppointment;
