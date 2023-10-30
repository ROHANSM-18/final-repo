import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER_DATA_KEY } from './config';
import { GET_MEDICAL_HISTORY_BY_PATIENT_ID } from '../graphql/queries/medicalhistorybypatientid';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';
import { GET_ALL_PATIENTS } from '../graphql/queries/getallpatients';
import {
  AppBar,
  Snackbar,
  Avatar,
  Toolbar,
  Grid,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733',
    },
  },
  typography: {
    h6: {
      textTransform: 'none',
    },
  },
});

const tableCellStyle = {
    width: '75%',
    margin: '0 auto',
  };

const DoctorMedical= () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));

  const { loading: doctorLoading, error: doctorError, data: doctorData } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });

  const { loading: patientsLoading, error: patientsError, data: patientsData } = useQuery(GET_ALL_PATIENTS);

  const filteredPatients = patientsData && patientsData.getAllPatients
    ? patientsData.getAllPatients.filter(
        (patient) => patient.Doctor && patient.Doctor.DoctorID === doctorData.getDoctorByUserId.DoctorID
      )
    : [];

  const { loading: medicalHistoryLoading, error: medicalHistoryError, data: medicalHistoryData } = useQuery(GET_MEDICAL_HISTORY_BY_PATIENT_ID, {
    variables: { patientId: selectedPatient },
  });

  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    setLogoutSnackbarOpen(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  const doctor = doctorData.getDoctorByUserId;
  const name = doctor.FirstName[0];

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button component={Link} to="/doctor-home" style={{ textDecoration: 'none', color: 'white' }}>
                  <Typography variant="h6" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                    <b>Health Analytics Platform</b>
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button component={Link} to="/doctor-vitals" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                      <p style={{ fontSize: '120%' }}><b>Vitals</b></p>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/medical-history" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                      <p style={{ fontSize: '120%' }}><b>Medical History</b></p>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/doctor-appointments" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                      <p style={{ fontSize: '120%' }}><b>Appointments</b></p>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button component={Link} to="/doctor-details">
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(251, 184, 170, 0.31)',
                    }}
                  >
                    {name}
                  </Avatar>
                </Button>
                <Button color="inherit" onClick={handleLogout} variant="outlined">
                  Log out
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <div>
          <h1>Doctor Medical History</h1>
          <div>
            <label>Select a Patient:</label>
            <select value={selectedPatient} onChange={(e) => handlePatientSelect(e.target.value)}>
              <option value="">Select a Patient</option>
              {filteredPatients.map((patient) => (
                <option key={patient.PatientID} value={patient.PatientID}>
                  {`${patient.FirstName} ${patient.LastName}`}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div>
              <h2>Medical History for Patient: {selectedPatient}</h2>
              {medicalHistoryLoading ? (
                <p>Loading medical history data...</p>
              ) : medicalHistoryError ? (
                <p>Error: {medicalHistoryError.message}</p>
              ) : medicalHistoryData && medicalHistoryData.getMedicalHistoryByPatientID ? (
                <div>
                  <p>Conditions: {medicalHistoryData.getMedicalHistoryByPatientID.Conditions}</p>
                  <p>Surgeries: {medicalHistoryData.getMedicalHistoryByPatientID.Surgeries}</p>
                  <p>Allergies: {medicalHistoryData.getMedicalHistoryByPatientID.Allergies}</p>
                  <p>Medications: {medicalHistoryData.getMedicalHistoryByPatientID.Medications}</p>
                </div>
              ) : (
                <p>No medical history data available for the selected patient.</p>
              )}
            </div>
          )}
        </div>
        <Snackbar open={logoutSnackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
          <MuiAlert severity="success" onClose={handleSnackbarClose}>
            Logged out successfully
          </MuiAlert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default DoctorMedical;
