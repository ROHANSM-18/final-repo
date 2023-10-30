import { gql } from '@apollo/client';

export const UPDATE_MEDICAL_HISTORY = gql`
mutation UpdateMedicalHistory($input: UpdateMedicalHistoryInput) {
    updateMedicalHistory(input: $input) {
      Surgeries
      Medications
      MedicalHistoryID
      Conditions
      Allergies
      Patient {
        PatientID
      }
    }
  }
`;