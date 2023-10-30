import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VITALS_BY_PATIENT_ID } from '../graphql/queries/getvitalsbypatientid';
import { USER_DATA_KEY } from './config';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Button,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Card,
  CardContent,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
  width: '50%',
  margin: '0 auto',
};

const Vitals = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const { loading, error, data } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });

  const patient = data.getPatientByUserId;
  const patientID = patient.PatientID;
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const name = patient.FirstName[0];

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
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  
  const { loading: vitalLoading, error: vitalError, data: vitalData } = useQuery(GET_VITALS_BY_PATIENT_ID, {
    variables: { patientId: patientID },
  });

  if (loading || vitalLoading) {
    return <p>Loading...</p>;
  }

  if (error || vitalError) {
    return <p>Error: {error ? error.message : vitalError.message}</p>;
  }

  const vitalsData = vitalData?.getVitalsByPatientID || [];
  const numVisits = vitalsData.length;
  const mostRecentVital = vitalsData[vitalsData.length - 1];

  const vitalLimits = {
    BloodPressure: { min: 60, max: 100 },
    HeartRate: { min: 60, max: 100 },
    RespiratoryRate: { min: 60, max: 100 },
    Temperature: { min: 96, max: 100 },
    OxygenSaturation: { min: 60, max: 100 },
  };

  const vitalColors = {
    BloodPressure: 'white',
    HeartRate: '#87cefa',
    RespiratoryRate: '#9de24f',
    Temperature: '#ff6666',
    OxygenSaturation: '#ffbd55',
  };

  const pieChartData = Object.keys(vitalLimits).map((vitalName) => ({
    name: vitalName,
    value: mostRecentVital[vitalName],
    message: getVitalMessage(vitalName, mostRecentVital[vitalName]),
    color: vitalColors[vitalName],
  }));

  const charts = [];

  Object.keys(vitalLimits).forEach((vitalName) => {
    if (vitalName !== 'BloodPressure') { 
      const chartData = vitalsData.map((vital) => ({
        name: formatDate(vital.VisitAppointment.DateAndTime), 
        value: vital[vitalName],
        color: vitalColors[vitalName],
        message: getVitalMessage(vitalName, vital[vitalName]),
      }));

      charts.push(
        <Grid item xs={4} key={vitalName}>
          <Card>
            <CardContent>
              <Typography variant="h6">{vitalName} Chart</Typography>
              <ResponsiveContainer width="80%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={vitalColors[vitalName]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  });

  
  function getVitalMessage(vitalName, value) {
    const { min, max } = vitalLimits[vitalName];
    if (value < min) {
      if (vitalName === 'RespiratoryRate') {
        return `low`;
      } else {
        return `too low`;
      }
    } else if (value > max) {
      return `too high`;
    }
    return 'Normal';
  }

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
        <div>
          {/* First Row */}
          <Grid container spacing={3}  style={{ marginTop: '1.5vh',marginBottom:'5vh'}}   >
            <Grid item xs={6}>
              <Paper elevation={3} style={{ marginLeft:'10vw', width:'60%', padding: '1.5%', color:'white' }}>
                <div style={{ backgroundColor: 'rgb(249, 85, 49)', padding: '5px' }}>
                  <Typography variant="h6" style = {{fontFamily: 'Josefin Sans, sans-serif', textTransform: 'none'}}>
                  <b>Number of Visits</b></Typography>
                  <Typography variant="h4">{numVisits}</Typography>
                </div>
              </Paper>
              <br/>
              <div style={{marginLeft:'4vw'}}>
              <TableContainer component={Paper} style={tableCellStyle}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#ff5733' }}>Visit ID</TableCell>
                  <TableCell style={{ color: '#ff5733' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vitalsData.map((vital) => (
                  <TableRow key={vital.vitalID}>
                    <TableCell>{vital.VisitAppointment.VisitID}</TableCell>
                    <TableCell>{formatDate(vital.VisitAppointment.DateAndTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: '20px', width:'70%', marginTop:'4vh' }}>
                <div style={{ backgroundColor: '', padding: '10px' }}>
                  {/* <Typography variant="h6">Recent Vital Chart</Typography> */}
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
                        fill="#8884d8"
                        label={({ name, message }) => {
                          return `${name} - ${message}`;
                        }}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {charts}
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Vitals;