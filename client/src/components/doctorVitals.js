import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER_DATA_KEY } from './config';
import { GET_VITALS_BY_PATIENT_ID } from '../graphql/queries/getvitalsbypatientid';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
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

const DoctorVitals = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [vitals, setVitals] = useState(null);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));

  const { loading: doctorLoading, error: doctorError, data: doctorData } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });

  const { loading: vitalsLoading, error: vitalsError, data: vitalsData } = useQuery(GET_VITALS_BY_PATIENT_ID, {
    variables: { patientId: selectedPatient },
  });

  const { loading: patientsLoading, error: patientsError, data: patientsData } = useQuery(GET_ALL_PATIENTS);

  const filteredPatients = patientsData && patientsData.getAllPatients
    ? patientsData.getAllPatients.filter(
        (patient) => patient.Doctor && patient.Doctor.DoctorID === doctorData.getDoctorByUserId.DoctorID
      )
    : [];

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
          <h1>Doctor Vitals</h1>
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
              <h2>Vitals for Patient: {selectedPatient}</h2>
              {vitalsLoading ? (
                <p>Loading vitals data...</p>
              ) : vitalsError ? (
                <p>Error: {vitalsError.message}</p>
              ) : vitalsData && vitalsData.getVitalsByPatientID.length > 0 ? (
                <TableContainer component={Paper} style={tableCellStyle}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ color: '#ff5733' }}>Heart Rate</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Blood Pressure</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Respiratory Rate</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Temperature</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Oxygen Saturation</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Visit ID</TableCell>
                        <TableCell style={{ color: '#ff5733' }}>Date and Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vitalsData.getVitalsByPatientID.map((vitalEntry) => (
                        <TableRow key={vitalEntry.VitalID}>
                          <TableCell >{vitalEntry.HeartRate}</TableCell>
                          <TableCell>{vitalEntry.BloodPressure}</TableCell>
                          <TableCell>{vitalEntry.RespiratoryRate}</TableCell>
                          <TableCell>{vitalEntry.Temperature}</TableCell>
                          <TableCell>{vitalEntry.OxygenSaturation}</TableCell>
                          <TableCell>{vitalEntry.VisitAppointment.VisitID}</TableCell>
                          <TableCell>{vitalEntry.VisitAppointment.DateAndTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <p>No vitals data available for the selected patient.</p>
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

export default DoctorVitals;
