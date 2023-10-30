import { gql } from '@apollo/client';

export const GET_VITALS_BY_PATIENT_ID = gql`
query GetVitalsByPatientID($patientId: String!) {
    getVitalsByPatientID(PatientID: $patientId) {
      VitalID
      BloodPressure
      HeartRate
      RespiratoryRate
      Temperature
      OxygenSaturation
      VisitAppointment {
        VisitID
        DateAndTime
      }
      Patient {
        PatientID
        FirstName
      }
      Doctor {
        DoctorID
        FirstName
      }
    }
  }
`;