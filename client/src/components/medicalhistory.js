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
  Container,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
import { GET_MEDICAL_HISTORY_BY_PATIENT_ID } from '../graphql/queries/medicalhistorybypatientid';
import { UPDATE_MEDICAL_HISTORY } from '../graphql/mutations/updatemedicalhistory';

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

const tableCellStyle = {
  width: '50%',
  margin: '0 auto',
};

const MedicalHistory = () => {
  const [setOpen] = useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const [updatedMedicalHistory, setUpdatedMedicalHistory] = useState({
    MedicalHistoryID: '', // This field will store the MedicalHistoryID
    Conditions: '',
    Surgeries: '',
    Allergies: '',
    Medications: '',
  });
  const [updateMode, setUpdateMode] = useState(false);

  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const { loading: patientLoading, error: patientError, data: patientData } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });
  const patient = patientData.getPatientByUserId;
  const patientID = patient.PatientID;

  const { loading: medicalLoading, error: medicalError, data: medicalData, refetch } = useQuery(GET_MEDICAL_HISTORY_BY_PATIENT_ID, {
    variables: { patientId: patientID },
  });

  const [updateMedicalHistory] = useMutation(UPDATE_MEDICAL_HISTORY);

  if (patientLoading || medicalLoading) return <p>Loading...</p>;
  if (patientError) return <p>Error: {patientError.message}</p>;
  if (medicalError) return <p>Error: {medicalError.message}</p>;

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

  const handleUpdateMedicalHistory = () => {
    console.log('Updating medical history:', updatedMedicalHistory);

    updateMedicalHistory({
      variables: {
        input: updatedMedicalHistory,
      },
    })
      .then((result) => {
        console.log('Medical history updated successfully:', result);

        // Refetch the medical history data to get the updated values
        refetch();

        // Exit update mode after a successful update
        setUpdateMode(false);
      })
      .catch((error) => {
        console.error('Error updating medical history:', error);
      });
  };

  const medicalHistoryData = medicalData.getMedicalHistoryByPatientID;

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
                <IconButton onClick={handleDrawerOpen}>
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
        <Container>
          <div className="main-content">
            <h2>
              Welcome, <span style={{ color: '#ff5733' }}>{patient.FirstName}</span>
            </h2>
            <TableContainer component={Paper} style={tableCellStyle}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medical History ID</TableCell>
                    <TableCell>Conditions</TableCell>
                    <TableCell>Surgeries</TableCell>
                    <TableCell>Allergies</TableCell>
                    <TableCell>Medications</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {updateMode ? (
                        <TextField
                          label="Medical History ID"
                          value={updatedMedicalHistory.MedicalHistoryID}
                          onChange={(e) =>
                            setUpdatedMedicalHistory({ ...updatedMedicalHistory, MedicalHistoryID: e.target.value })
                          }
                        />
                      ) : (
                        medicalHistoryData.MedicalHistoryID
                      )}
                    </TableCell>
                    <TableCell>
                      {updateMode ? (
                        <TextField
                          label="Conditions"
                          value={updatedMedicalHistory.Conditions}
                          onChange={(e) =>
                            setUpdatedMedicalHistory({ ...updatedMedicalHistory, Conditions: e.target.value })
                          }
                        />
                      ) : (
                        medicalHistoryData.Conditions
                      )}
                    </TableCell>
                    <TableCell>
                      {updateMode ? (
                        <TextField
                          label="Surgeries"
                          value={updatedMedicalHistory.Surgeries}
                          onChange={(e) =>
                            setUpdatedMedicalHistory({ ...updatedMedicalHistory, Surgeries: e.target.value })
                          }
                        />
                      ) : (
                        medicalHistoryData.Surgeries
                      )}
                    </TableCell>
                    <TableCell>
                      {updateMode ? (
                        <TextField
                          label="Allergies"
                          value={updatedMedicalHistory.Allergies}
                          onChange={(e) =>
                            setUpdatedMedicalHistory({ ...updatedMedicalHistory, Allergies: e.target.value })
                          }
                        />
                      ) : (
                        medicalHistoryData.Allergies
                      )}
                    </TableCell>
                    <TableCell>
                      {updateMode ? (
                        <TextField
                          label="Medications"
                          value={updatedMedicalHistory.Medications}
                          onChange={(e) =>
                            setUpdatedMedicalHistory({ ...updatedMedicalHistory, Medications: e.target.value })
                          }
                        />
                      ) : (
                        medicalHistoryData.Medications
                      )}
                    </TableCell>
                    <TableCell>
                      {updateMode ? (
                        <Button variant="contained" color="primary" onClick={handleUpdateMedicalHistory}>
                          Update
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={() => setUpdateMode(true)}>
                          Update
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Container>
        <Snackbar open={logoutSnackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
          <MuiAlert severity="success" onClose={handleSnackbarClose}>
            Logged out successfully
          </MuiAlert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default MedicalHistory;
