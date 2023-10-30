import { gql } from '@apollo/client';

export const GET_DOCTOR_BY_USER_ID = gql`
query GetDoctorByUserId($getDoctorByUserIdId: Int!) {
    getDoctorByUserId(id: $getDoctorByUserIdId) {
      DoctorID
      FirstName
      LastName
      DateOfBirth
      Gender
      ContactInformation
      UserID {
        id
      }
    }
  }
`;

