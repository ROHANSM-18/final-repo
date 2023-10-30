import { gql } from '@apollo/client';

export const GET_APPOINTMENTS_BY_DOCTOR_ID= gql`
query GetVisitAppointmentsByDoctorID($doctorId: String!) {
    getVisitAppointmentsByDoctorID(DoctorID: $doctorId) {
      VisitID
      DateAndTime
      Provider
      ReasonForVisit
      Diagnosis
      Prescriptions
      Patient {
        PatientID
        FirstName
      }
      Doctor {
        DoctorID
      }
    }
  }
`;