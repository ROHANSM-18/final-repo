import { gql } from '@apollo/client';

export const GET_ALL_PATIENTS = gql`
query GetAllPatients {
    getAllPatients {
      PatientID
      FirstName
      LastName
      DateOfBirth
      Gender
      ContactInformation
      Doctor {
        DoctorID
      }
    }
  }
`;