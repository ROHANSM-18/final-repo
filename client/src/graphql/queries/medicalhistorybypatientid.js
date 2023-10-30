import { gql } from '@apollo/client';

export const GET_MEDICAL_HISTORY_BY_PATIENT_ID = gql`
query GetMedicalHistoryByPatientID($patientId: String!) {
    getMedicalHistoryByPatientID(PatientID: $patientId) {
      MedicalHistoryID
      Conditions
      Surgeries
      Allergies
      Medications
      Patient {
        PatientID
      }
    }
  }
`;