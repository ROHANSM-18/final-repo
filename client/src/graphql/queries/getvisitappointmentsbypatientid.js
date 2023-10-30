import { gql } from '@apollo/client';

export const GET_VISIT_APPOINTMENTS_BY_PATIENT_ID = gql`
query GetVisitAppointmentsByPatientID($patientId: String!) {
    getVisitAppointmentsByPatientID(PatientID: $patientId) {
      VisitID
      DateAndTime
      Provider
      ReasonForVisit
      Diagnosis
      Prescriptions
      Patient {
        PatientID
      }
      Doctor {
        DoctorID
      }
    }
  }
`;