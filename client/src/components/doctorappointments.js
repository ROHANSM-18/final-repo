import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { USER_DATA_KEY } from './config';
import { GET_APPOINTMENTS_BY_DOCTOR_ID } from '../graphql/queries/getappointmentsbydoctorid';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';
import { GET_ALL_PATIENTS } from '../graphql/queries/getallpatients';
import {UPDATE_VISIT_APPOINTMENTS} from '../graphql/mutations/updateVisitAppointment'
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
  Dialog, DialogTitle, DialogContent, TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import backgroundImage from '../components/Screenshot_1.png';


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

const DoctorAppointments = () => {
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false); // State to manage the update dialog
  const [refreshing, setRefreshing] = useState(false); // Add a state to control refreshing

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));

  const { loading: doctorLoading, error: doctorError, data: doctorData } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });

  const doctor = doctorData.getDoctorByUserId;

 
  const { loading: patientsLoading, error: patientsError, data: patientsData } = useQuery(GET_ALL_PATIENTS);

  const { loading: appointmentsLoading, error: appointmentsError, data: appointmentsData } = useQuery(GET_APPOINTMENTS_BY_DOCTOR_ID, {
    variables: { doctorId: doctor.DoctorID },
  });

  const appointmentDetails = appointmentsData ? appointmentsData.getVisitAppointmentsByDoctorID : [];

  const filteredPatients = patientsData && patientsData.getAllPatients
    ? patientsData.getAllPatients.filter(
        (patient) => patient.Doctor && patient.Doctor.DoctorID === doctorData.getDoctorByUserId.DoctorID
      )
    : [];

 
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

  const handleUpdateDialogOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setSelectedAppointment(null);
    setUpdateDialogOpen(false);
  };

  const [updateVisitAppointment] = useMutation(UPDATE_VISIT_APPOINTMENTS); // Define the mutation

  const handleUpdateAppointment = (updatedData) => {
    const { VisitID, Diagnosis, Prescriptions, Provider } = updatedData;
    updateVisitAppointment({
      variables: {
        visitId: VisitID,
        input: {
          Diagnosis,
          Prescriptions,
          Provider,
        },
      },
    })
      .then((response) => {
        console.log('Appointment updated:', response);
        handleUpdateDialogClose();

      })
      .catch((error) => {
        // Handle mutation error
        console.error('Error updating appointment:', error);
        // Optionally, you can display an error message to the user
      });
  };




  // const doctor = doctorData.getDoctorByUserId;
  const name = doctor.FirstName[0];

  return (
    <ThemeProvider theme={theme}>
      <div div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'repeat', height:'100vh'}}>
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
        <h1>Your Appointments</h1>
          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>VisitID</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Date and Time</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Provider</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Reason for Visit</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Diagnosis</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Prescriptions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointmentDetails.map((appointment) => (
                  <TableRow key={appointment.VisitID}>
                    <TableCell>{appointment.VisitID}</TableCell>
                    <TableCell>{formatDate(appointment.DateAndTime)}</TableCell>
                    <TableCell>{appointment.Provider}</TableCell>
                    <TableCell>{appointment.ReasonForVisit}</TableCell>
                    <TableCell>{appointment.Diagnosis}</TableCell>
                    <TableCell>{appointment.Prescriptions}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateDialogOpen(appointment)}>Update</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {selectedAppointment && (
          <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
            <DialogTitle>Update Appointment</DialogTitle>
            <DialogContent>
              {/* Create input fields for updating appointment details */}
              <TextField
                label="Diagnosis"
                value={selectedAppointment.Diagnosis}
                onChange={(e) =>
                  setSelectedAppointment({ ...selectedAppointment, Diagnosis: e.target.value })
                }
              />
              <TextField
                label="Prescriptions"
                value={selectedAppointment.Prescriptions}
                onChange={(e) =>
                  setSelectedAppointment({ ...selectedAppointment, Prescriptions: e.target.value })
                }
              />
              <TextField
                label="Provider"
                value={selectedAppointment.Provider}
                onChange={(e) =>
                  setSelectedAppointment({ ...selectedAppointment, Provider: e.target.value })
                }
              />
              {/* Add a submit button to update the appointment */}
              <Button onClick={() => handleUpdateAppointment(selectedAppointment)}>
                Update Appointment
              </Button>
            </DialogContent>
          </Dialog>
        )}
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
