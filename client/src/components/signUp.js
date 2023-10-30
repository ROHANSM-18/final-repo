
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate  } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733', 
    },
  },
});

const SIGNUP_MUTATION = gql`
    mutation Signup($input: SignupInput) {
    signup(input: $input) {
      id
      email
      role
    }
  }
`;

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
    },
    formContainer: {
      width: '100%',
      maxWidth: '800px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    input: {
      marginBottom: '10px',
      width: '100%',
    },
    button: {
      background: theme.palette.primary.main,
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      padding: '10px 15px',
      cursor: 'pointer',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    successMessage: {
      color: 'green',
      marginBottom: '10px',
    },
  };
  
function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: 'F',
    contactInformation: '',
    password: '',
    role: 'patient',
  });

  const [signup] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ variables: { input: formData } });
      console.log('Signup successful:', data);

      if (data.signup.role === 'patient' || data.signup.role === 'doctor') {
        setSuccessOpen(true); 

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Signup failed',error);
      setErrorMessage(error.message); 
      setErrorOpen(true); 
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={styles.column}>
              <TextField
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                label="First Name"
                variant="outlined"
                style={styles.input}
              />
              <TextField
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                label="Last Name"
                variant="outlined"
                style={styles.input}
              />
              <TextField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                variant="outlined"
                style={styles.input}
              />
              <TextField
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                label="Date of Birth"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                placeholder=""
                style={styles.input}
                />


            </Grid>
            <Grid item xs={6} style={styles.column}>
            <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
                variant="outlined"
                style={styles.input}
              >
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
              <TextField
                type="text"
                name="contactInformation"
                value={formData.contactInformation}
                onChange={handleChange}
                label="Contact Information"
                variant="outlined"
                style={styles.input}
              />
              <TextField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                variant="outlined"
                style={styles.input}
              />
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
                variant="outlined"
                style={styles.input}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button type="submit" style={styles.button}>
            Sign Up
          </Button>
        </form>
        <ErrorPopup open={errorOpen} message={errorMessage} handleClose={() => setErrorOpen(false)} />
      </div>
    </div>
    <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleCloseSuccess} severity="success">
          Signup Successful
        </MuiAlert>
      </Snackbar>
  </ThemeProvider>
  );
}

function ErrorPopup({ open, message, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleClose}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}


export default Signup;