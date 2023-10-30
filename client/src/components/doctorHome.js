import React, { useState, useEffect } from 'react';
import { USER_DATA_KEY } from './config';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';
import { GET_ALL_PATIENTS } from '../graphql/queries/getallpatients';
import { ADD_DOCTOR_TO_PATIENT } from '../graphql/mutations/addDoctortoPatient';
import {
  AppBar,
  Snackbar,
  Avatar,
  Toolbar,
  Grid,
  Box,
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
  Menu,
  MenuItem,
} from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import '../App.css';
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
  width: '70%',
  margin: '0 auto',
};

const DoctorHome = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const { loading: doctorLoading, error: doctorError, data: doctorData } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });
  const { loading: patientsLoading, error: patientsError, data: patientsData } = useQuery(GET_ALL_PATIENTS);

  const [open, setOpen] = useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for selected patient
  const [anchorEl, setAnchorEl] = useState(null);
  const [patientAdded, setPatientAdded] = useState(false); // State for patient added status

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const [addDoctorToPatient] = useMutation(ADD_DOCTOR_TO_PATIENT, {
    onCompleted: (data) => {
      // Handle the mutation completion here
      setPatientAdded(true); // Set the patientAdded state to true
    },
    onError: (error) => {
      // Handle any mutation errors here
    },
  });

  // Use the useEffect hook to refresh the window when patientAdded becomes true
  useEffect(() => {
    if (patientAdded) {
      window.location.reload();
    }
  }, [patientAdded]);

  if (doctorLoading || patientsLoading) return <p>Loading...</p>;
  if (doctorError) return <p>Error: {doctorError.message}</p>;
  if (patientsError) return <p>Error: {patientsError.message}</p>;

  const doctor = doctorData.getDoctorByUserId;
  const currentDoctorID = doctor.DoctorID;
  const filteredPatients = patientsData.getAllPatients.filter(
    (patient) => patient.Doctor && patient.Doctor.DoctorID === currentDoctorID
  );
  const name = doctor.FirstName[0];

  const handleAddPatientClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setAnchorEl(null); // Close the dropdown menu
  };

  const handleAddDoctorToPatient = () => {
    if (selectedPatient) {
      addDoctorToPatient({
        variables: {
          input: {
            DoctorID: doctor.DoctorID,
            PatientID: selectedPatient.PatientID,
          },
        },
      });
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'repeat', height:'100vh'}}>
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
        <div >
          <h2 style={{ textAlign: 'center', marginTop: '5vh', marginBottom: '5vh' }}>
            Welcome,<span style={{ color: '#ff5733' }}> Dr. {doctor.LastName}</span>
          </h2>

          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Patient ID</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>First Name</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Last Name</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Date of Birth</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Age</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Gender</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Contact Information</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.PatientID}>
                    <TableCell>{patient.PatientID}</TableCell>
                    <TableCell>{patient.FirstName}</TableCell>
                    <TableCell>{patient.LastName}</TableCell>
                    <TableCell>{formatDate(patient.DateOfBirth)}</TableCell>
                    <TableCell>{calculateAge(patient.DateOfBirth)}</TableCell>
                    <TableCell>{patient.Gender}</TableCell>
                    <TableCell>{patient.ContactInformation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddPatientClick}
            style={{ marginTop: '5vh', marginBottom: '2vh' }}
          >
            Add Patient
          </Button>
          {selectedPatient && (
            <p>
              <span style={{ fontWeight: 'bold' }}> Selected Patient: &nbsp;</span>
              <span style={{ color: 'red' }}> {selectedPatient.FirstName} {selectedPatient.LastName} </span>
            </p>
          )}
          {selectedPatient && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDoctorToPatient}
              style={{ marginTop: '2vh' }}
            >
              SUBMIT
            </Button>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {patientsData.getAllPatients.map((patient) => (
              <MenuItem
                key={patient.PatientID}
                onClick={() => handlePatientSelect(patient)}
              >
                {patient.FirstName} {patient.LastName}
              </MenuItem>
            ))}
          </Menu>
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

export default DoctorHome;