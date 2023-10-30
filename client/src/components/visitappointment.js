import React, { useState } from 'react';
import { USER_DATA_KEY } from './config';
import { useQuery, useMutation } from '@apollo/client';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
import { GET_VISIT_APPOINTMENTS_BY_PATIENT_ID } from '../graphql/queries/getvisitappointmentsbypatientid';
import { CREATE_VISIT_APPOINTMENTS } from '../graphql/mutations/CreateVisitAppointments';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733',
    },
  },
  typography: {
    fontFamily: 'Forte',
  },
});

const VisitAppointments = () => {
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    VisitID: '',
    ReasonForVisit: '',
    Provider: '',
    Prescriptions: '',
    Diagnosis: '',
    DateAndTime: '',
    DoctorID: '',
    PatientID: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false); // To toggle the visibility of the "Create New Appointment" form

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const { loading: patientLoading, error: patientError, data: patientData } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });
  const patient = patientData.getPatientByUserId;
  const patientID = patient.PatientID;

  const { loading: appointmentsLoading, error: appointmentsError, data: appointmentsData, refetch } = useQuery(GET_VISIT_APPOINTMENTS_BY_PATIENT_ID, {
    variables: { patientId: patientID },
  });

  const [createVisitAppointment] = useMutation(CREATE_VISIT_APPOINTMENTS);

  const name = patient.FirstName[0];

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  const handleCreateAppointment = () => {
    createVisitAppointment({
      variables: {
        input: {
          ...newAppointment,
          DoctorID: newAppointment.DoctorID,
          PatientID: newAppointment.PatientID,
        },
      },
    })
      .then(() => {
        refetch();
        setNewAppointment({
          VisitID: '',
          ReasonForVisit: '',
          Provider: '',
          Prescriptions: '',
          Diagnosis: '',
          DateAndTime: '',
          DoctorID: '',
          PatientID: '', // Reset DoctorID and PatientID fields
        });
        setShowCreateForm(false); // Close the "Create New Appointment" form
      })
      .catch((error) => {
        console.error('Error creating appointment:', error);
      });
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  if (patientLoading || appointmentsLoading) return <p>Loading...</p>;
  if (patientError) return <p>Error: {patientError.message}</p>;
  if (appointmentsError) return <p>Error: {appointmentsError.message}</p>;

  const visitAppointments = appointmentsData.getVisitAppointmentsByPatientID;

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button component={Link} to="/patient-home" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                  <Typography variant="h6" className="logo-style">
                    Health Analytics Platform
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button component={Link} to="/vitals" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                      Vitals
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/medical-history" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                      Medical History
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/appointments" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                      Appointments
                    </Button>
                  </Grid>
                 
                </Grid>
              </Grid>
              <Grid item>
                <IconButton>
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(250, 235, 215, 0.901)',
                    }}
                  >
                    {name}
                  </Avatar>
                </IconButton>
                <Button color="inherit" onClick={handleLogout} variant="outlined">
                  Log out
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className="main-content">
          <h2>
            Welcome, <span style={{ color: '#ff5733' }}>{patient.FirstName}</span>
          </h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>VisitID</TableCell>
                  <TableCell>Date and Time</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Reason for Visit</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Prescriptions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitAppointments.map((appointment) => (
                  <TableRow key={appointment.VisitID}>
                    <TableCell>{appointment.VisitID}</TableCell>
                    <TableCell>{appointment.DateAndTime}</TableCell>
                    <TableCell>{appointment.Provider}</TableCell>
                    <TableCell>{appointment.ReasonForVisit}</TableCell>
                    <TableCell>{appointment.Diagnosis}</TableCell>
                    <TableCell>{appointment.Prescriptions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: '20px' }}>
            {showCreateForm ? ( // Render the "Create New Appointment" form when showCreateForm is true
              <div>
                <h3>Create New Appointment</h3>
                <TextField
                  label="VisitID"
                  value={newAppointment.VisitID}
                  onChange={(e) => setNewAppointment({ ...newAppointment, VisitID: e.target.value })}
                />
                <TextField
                  label="Date and Time"
                  value={newAppointment.DateAndTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, DateAndTime: e.target.value })}
                />
                <TextField
                  label="Provider"
                  value={newAppointment.Provider}
                  onChange={(e) => setNewAppointment({ ...newAppointment, Provider: e.target.value })}
                />
                <TextField
                  label="Reason for Visit"
                  value={newAppointment.ReasonForVisit}
                  onChange={(e) => setNewAppointment({ ...newAppointment, ReasonForVisit: e.target.value })}
                />
                <TextField
                  label="Diagnosis"
                  value={newAppointment.Diagnosis}
                  onChange={(e) => setNewAppointment({ ...newAppointment, Diagnosis: e.target.value })}
                />
                <TextField
                  label="Prescriptions"
                  value={newAppointment.Prescriptions}
                  onChange={(e) => setNewAppointment({ ...newAppointment, Prescriptions: e.target.value })}
                />
                <TextField
                  label="Doctor ID"
                  value={newAppointment.DoctorID}
                  onChange={(e) => setNewAppointment({ ...newAppointment, DoctorID: e.target.value })}
                />
                <TextField
                  label="Patient ID"
                  value={newAppointment.PatientID}
                  onChange={(e) => setNewAppointment({ ...newAppointment, PatientID: e.target.value })}
                />


                <Button variant="contained" color="primary" onClick={handleCreateAppointment}>
                  Create
                </Button>
              </div>
            ) : (
              <Button variant="contained" color="primary" onClick={toggleCreateForm}>
                Create New Appointment
              </Button>
            )}
          </div>
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

export default VisitAppointments;
