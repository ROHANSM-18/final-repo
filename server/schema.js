const { gql } = require('apollo-server');

const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-scalars');

const typeDefs = gql`
  scalar Date
  scalar Time
  scalar DateTime

  type Patient {
    PatientID: String
    FirstName: String
    LastName: String
    DateOfBirth: Date
    Gender: String
    ContactInformation: String
    Doctor: Doctor
    UserID: User
  }

  type Doctor {
    DoctorID: String
    FirstName: String
    LastName: String
    DateOfBirth: Date
    Gender: String
    ContactInformation: String
    UserID: User
  }

  type MedicalHistory {
    MedicalHistoryID: String
    Conditions: String
    Surgeries: String
    Allergies: String
    Medications: String
    Patient: Patient
  }

  type VisitAppointment {
    VisitID: String
    DateAndTime: DateTime
    Provider: String
    ReasonForVisit: String
    Diagnosis: String
    Prescriptions: String
    Patient: Patient
    Doctor: Doctor
    LabResults: [LabResult]
    Vitals: [Vital]
  }

  input CreateVisitAppointmentInput {
    VisitID: String
    DateAndTime: DateTime
    Provider: String
    ReasonForVisit: String
    Diagnosis: String
    Prescriptions: String
    DoctorID: String
    PatientID : String
    # Add other fields as needed
  }
  
  input UpdateVisitAppointmentInput {
    DateAndTime: DateTime
    Provider: String
    ReasonForVisit: String
    Diagnosis: String
    Prescriptions: String
    DoctorID: String
    PatientID: String 
    # Add other fields as needed
  }

  type LabResult {
    ResultID: String
    TestName: String
    TestDate: Date
    TestResults: String
    VisitAppointment: VisitAppointment
    Patient: Patient
    Doctor: Doctor
  }

  type Vital {
    VitalID: String
    BloodPressure: String
    HeartRate: Int
    RespiratoryRate: Int
    Temperature: Float
    OxygenSaturation: Float
    VisitAppointment: VisitAppointment
    Patient: Patient
    Doctor: Doctor
  }

  type User {
    id: Int
    email: String
    role: UserRole
  }

  enum UserRole {
    doctor
    patient
  }

  enum genderList {
    F
    M
    O
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: UserRole!
    dateOfBirth: Date!
    gender: genderList!
    contactInformation: String!
  }

  input CreateVitalInput {
    BloodPressure: String
    HeartRate: Int
    RespiratoryRate: Int
    Temperature: Float
    OxygenSaturation: Float
    PatientID: String
    DoctorID: String
    VisitID: String  # Assuming VisitID is a string
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input AddDoctorToPatientInput {
    DoctorID: String!
    PatientID: String!
  }

  input UpdateMedicalHistoryInput {
    MedicalHistoryID: String!
    Conditions: String
    Surgeries: String
    Allergies: String
    Medications: String
    PatientID: String 
  }

  type Mutation {
    signup(input: SignupInput): User
    login(input: LoginInput): User
    addDoctorToPatient(input: AddDoctorToPatientInput): Patient
    updateMedicalHistory(input: UpdateMedicalHistoryInput): MedicalHistory
    createVisitAppointment(input: CreateVisitAppointmentInput): VisitAppointment
    updateVisitAppointment(VisitID: String, input: UpdateVisitAppointmentInput): VisitAppointment
    createVital(input: CreateVitalInput): Vital
    addVitalsByPatientID(input: CreateVitalInput): Vital
  }

  type Query {
    getAllPatients: [Patient]
    getAllDoctors: [Doctor]
    getMedicalHistoryByPatientID(PatientID: String!): MedicalHistory
    getVisitAppointmentsByPatientID(PatientID: String!): [VisitAppointment]
    getLabResultsByPatientID(PatientID: String!): [LabResult]
    getVitalsByPatientID(PatientID: String!): [Vital]
    getPatientByUserId(id: Int!): Patient
    getDoctorByUserId(id: Int!): Doctor
    getVisitAppointmentsByDoctorID(DoctorID: String!): [VisitAppointment] # New query
  }
`;

module.exports = typeDefs;