import { gql } from '@apollo/client';

export const CREATE_VISIT_APPOINTMENTS = gql`
mutation CreateVisitAppointment($input: CreateVisitAppointmentInput) {
    createVisitAppointment(input: $input) {
      VisitID
      ReasonForVisit
      Provider
      Prescriptions
      Diagnosis
      DateAndTime
      Patient {
        PatientID
      }
      Doctor {
        DoctorID
      }
    }
  }
`;