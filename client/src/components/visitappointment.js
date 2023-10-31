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
import { GET_ALL_PATIENTS } from '../graphql/queries/getallpatients';

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
  width: '70%',
  margin: '0 auto',
};


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

  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };  

  const getNextVisitID = () => {
    // Find the largest existing VisitID and auto-increment it
    const largestVisitID = visitAppointments.reduce((largest, appointment) => {
      const visitIDNumber = Number(appointment.VisitID.slice(2)); // Extract the numeric part of VisitID
      return visitIDNumber > largest ? visitIDNumber : largest;
    }, 0);
    
    // Generate the new VisitID
    const newVisitID = `VA${(largestVisitID + 1).toString().padStart(4, '0')}`;

    
    return newVisitID;
  };

  const handleCreateAppointment = () => {
    const newVisitID = getNextVisitID(); // Generate a new VisitID
    createVisitAppointment({
      variables: {
        input: {
          DateAndTime: newAppointment.DateAndTime,
          VisitID: newVisitID,
          ReasonForVisit: newAppointment.ReasonForVisit,
          Diagnosis: newAppointment.Diagnosis,
          DoctorID: newAppointment.DoctorID,
          PatientID: patientID,
          Prescriptions: newAppointment.Prescriptions,
          Provider: newAppointment.Provider,
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
          PatientID: '',
        });
        setShowCreateForm(false);
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
                  <Typography variant="h6" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                  <b>Health Analytics Platform</b>
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button component={Link} to="/vitals" variant="text" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                    <p style={{ fontSize: '120%' }}><b>Vitals</b></p>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/medical-history" variant="text" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                    <p style={{ fontSize: '120%' }}><b>Medical History</b></p>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/appointments" variant="text" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }}>
                    <p style={{ fontSize: '120%' }}><b>Appointments</b></p>
                    </Button>
                  </Grid>
                 
                </Grid>
              </Grid>
              <Grid item>
                <IconButton>
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(251, 184, 170, 0.31)',
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
          <h2 style={{ margin: '5vh 1 vw' }}>
           All Appointments
          </h2>
          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>VisitID</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Date and Time</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Provider</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Reason for Visit</TableCell>
                  <TableCell style={{ color: '#ff5733' }} >Diagnosis</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Prescriptions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitAppointments.map((appointment) => (
                  <TableRow key={appointment.VisitID}>
                    <TableCell>{appointment.VisitID}</TableCell>
                    <TableCell>{formatDate(appointment.DateAndTime)}</TableCell>
                    <TableCell>{appointment.Provider}</TableCell>
                    <TableCell>{appointment.ReasonForVisit}</TableCell>
                    <TableCell>{appointment.Diagnosis}</TableCell>
                    <TableCell>{appointment.Prescriptions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
         <br/>
          <div style={{ marginTop: '20px' }}>
            {showCreateForm ? ( // Render the "Create New Appointment" form when showCreateForm is true
              <div>
                <h3>Create New Appointment</h3>
                <TextField
                  style={{ marginRight: '3vw' }}
                  type="date"
                  value={newAppointment.DateAndTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, DateAndTime: e.target.value })}
                  renderInput={(params) => <TextField {...params} />}
                  />


                <TextField style={{marginRight:'3vw'}}
                  label="Reason for Visit"
                  value={newAppointment.ReasonForVisit}
                  onChange={(e) => setNewAppointment({ ...newAppointment, ReasonForVisit: e.target.value })}
                />
                <TextField
                  label="Doctor ID"
                  value={newAppointment.DoctorID}
                  onChange={(e) => setNewAppointment({ ...newAppointment, DoctorID: e.target.value })}
                /> <br/>
                <Button variant="contained" color="primary" onClick={handleCreateAppointment} style={{marginTop: '4vh'}}>
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
