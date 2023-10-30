import { gql } from '@apollo/client';

export const UPDATE_VISIT_APPOINTMENTS= gql`
mutation UpdateVisitAppointment($visitId: String, $input: UpdateVisitAppointmentInput) {
    updateVisitAppointment(VisitID: $visitId, input: $input) {
      VisitID
      ReasonForVisit
      Provider
      Prescriptions
      Patient {
        PatientID
      }
      Diagnosis
      DateAndTime
    }
  }
`;