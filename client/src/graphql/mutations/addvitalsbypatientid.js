import { gql } from '@apollo/client';

export const ADD_VITALS_BY_PATIENT_ID = gql`
mutation AddVitalsByPatientID($input: CreateVitalInput) {
    addVitalsByPatientID(input: $input) {
      BloodPressure
      HeartRate
      RespiratoryRate
      Temperature
      OxygenSaturation
      VisitAppointment {
        VisitID
      }
      Patient {
        PatientID
      }
      Doctor {
        DoctorID
      }
      VitalID
    }
  }
`;