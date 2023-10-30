import { gql } from '@apollo/client';

export const GET_PATIENT_BY_USER_ID = gql`
query GetPatientByUserId($getPatientByUserIdId: Int!) {
  getPatientByUserId(id: $getPatientByUserIdId) {
    PatientID
    FirstName
    LastName
    DateOfBirth
    Gender
    ContactInformation
    Doctor {
      DoctorID
      FirstName
    }
    UserID {
      id
      email
    }
  }
}
`;

