import React, { useState } from 'react';
import { USER_DATA_KEY } from './config';
import { useQuery } from '@apollo/client';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';
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
import '../App.css'


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
  width: '30%',
  margin: '0 auto',
};

const DoctorDetails = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const doctor = data.getDoctorByUserId;
  const name = doctor.FirstName[0];
 

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
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
              <Button component={Link} to="/doctor-home" style={{ textDecoration: 'none' , color:'white' }} >

<Typography  variant="h6" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
  <b> Health Analytics Platform</b>
</Typography>
 </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
               <Button component={Link} to="/doctor-vitals"  style={{ textDecoration: 'none' , color:'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }} >
                  <p style={{ fontSize: '120%'}} > <b> Vitals </b></p>
                 </Button>
                  </Grid>
                  <Grid item>
                  <Button component={Link} to="/doctor-medical"  style={{ textDecoration: 'none' , color:'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }} >
                  <p style={{ fontSize: '120%'}} > <b>  Medical History </b></p>
                 </Button>
                  </Grid>
                  <Grid item>
                  <Button component={Link} to="/doctor-appointments"  style={{ textDecoration: 'none' , color:'white', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none' }} >
                  <p style={{ fontSize: '120%'}} > <b>          Appointments </b></p>
                 </Button>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item>
              <Button component={Link} to="/doctor-details" >
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
        <div className="main-content">
          <h2  style={{ textAlign: 'center', marginTop: '5vh'}}>
            Welcome, <span style={{ color: '#ff5733'}}>{doctor.FirstName}</span>
          </h2>
          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>First Name:</TableCell>
                  <TableCell>{doctor.FirstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name:</TableCell>
                  <TableCell>{doctor.LastName}</TableCell>
                </TableRow>
             
                <TableRow>
                  <TableCell>Gender:</TableCell>
                  <TableCell>{doctor.Gender}</TableCell>
                </TableRow>
             
                <TableRow>
                  <TableCell>Contact Information:</TableCell>
                  <TableCell>{doctor.ContactInformation}</TableCell>
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

export default DoctorDetails;