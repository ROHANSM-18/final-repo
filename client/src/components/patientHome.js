import React, { useState } from 'react';
import { USER_DATA_KEY } from './config';
import { useQuery } from '@apollo/client';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
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
} from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
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

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

const tableCellStyle = {
  width: '34%',
  margin: '0 auto',
};

const PatientHome = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const patient = data.getPatientByUserId;
  const name = patient.FirstName[0];
  const age = calculateAge(patient.DateOfBirth);
  const dateOfBirth = new Date(patient.DateOfBirth);
  const formattedDateOfBirth = dateOfBirth.toDateString();

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
              <Button component={Link} to="/patient-home" variant="text" style={{ textDecoration: 'none' , color:'white' }} >

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
                  <Button component={Link} to="/medical-history" variant="text" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }} >
                  <p style={{ fontSize: '120%' }}><b>Medical History</b></p>
                 </Button>
                  </Grid>
                  <Grid item>
                  <Button component={Link} to="/appointments" variant="text" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }} >
                  <p style={{ fontSize: '120%' }}><b>Appointments</b></p>
                 </Button>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item>
                <IconButton onClick={handleDrawerOpen}>
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
        <div >
          <h2 style={{ textAlign: 'center', marginTop: '5vh', marginBottom: '5vh' }}>
            Welcome, <span style={{ color: '#ff5733' }}>{patient.FirstName}</span>
          </h2>
          
          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ color: '#ff5733', width: '50%' }}> First Name: </TableCell>
                  <TableCell>{patient.FirstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Last Name:</TableCell>
                  <TableCell>{patient.LastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Date of Birth:</TableCell>
                  <TableCell>{formattedDateOfBirth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Gender:</TableCell>
                  <TableCell>{patient.Gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Age:</TableCell>
                  <TableCell>{age} years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Contact Information:</TableCell>
                  <TableCell>{patient.ContactInformation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Email:</TableCell>
                  <TableCell>{patient.UserID && patient.UserID.email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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

export default PatientHome;