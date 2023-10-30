import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER_DATA_KEY } from './config';
import { GET_APPOINTMENTS_BY_DOCTOR_ID } from '../graphql/queries/getappointmentsbydoctorid';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';
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

const DoctorAppointments = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));

  const { loading: doctorLoading, error: doctorError, data: doctorData } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });

  const doctor = doctorData?.getDoctorByUserId;
  const doctorId = doctor?.DoctorID;

  const { loading: appointmentLoading, error: appointmentError, data: appointmentData } = useQuery(GET_APPOINTMENTS_BY_DOCTOR_ID, {
    variables: { doctorId },
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

  const name = doctor?.FirstName[0];

  const filteredPatients = doctorData?.getDoctorByUserId?.Patients || [];

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

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
                    <Button component={Link} to="/doctor-medical" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
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
              {appointmentLoading ? (
                <p>Loading medical history data...</p>
              ) : appointmentError ? (
                <p>Error: {appointmentError.message}</p>
              ) : appointmentData?.getVisitAppointmentsByDoctorID ? (
                <div>
                  {appointmentData.getVisitAppointmentsByDoctorID.map((appointment) => (
                    <div key={appointment.VisitID}>
                      <p>Visit ID: {appointment.VisitID}</p>
                      <p>Date and Time: {appointment.DateAndTime}</p>
                      <p>Provider: {appointment.Provider}</p>
                      <p>Reason for Visit: {appointment.ReasonForVisit}</p>
                      <p>Diagnosis: {appointment.Diagnosis}</p>
                      <p>Prescriptions: {appointment.Prescriptions}</p>
                      <p>Patient ID: {appointment.Patient.PatientID}</p>
                      <p>Patient Name: {appointment.Patient.FirstName}</p>
                      <p>Doctor ID: {appointment.Doctor.DoctorID}</p>
                    </div>
                  ))}
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

export default DoctorAppointments;
