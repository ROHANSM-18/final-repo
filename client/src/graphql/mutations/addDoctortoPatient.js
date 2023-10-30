import { gql } from '@apollo/client';

export const ADD_DOCTOR_TO_PATIENT = gql`
mutation AddDoctorToPatient($input: AddDoctorToPatientInput) {
    addDoctorToPatient(input: $input) {
      PatientID
      FirstName
      LastName
      DateOfBirth
      Gender
      ContactInformation
    }
  }
`;