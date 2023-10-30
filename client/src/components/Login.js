
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate  } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { USER_DATA_KEY } from './config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733', 
    },
  },
});


const LOGIN_MUTATION = gql`
mutation Mutation($input: LoginInput) {
    login(input: $input) {
      id
      email
      role
    }
  }
`;

function Login() {
  const [formData, setFormData] = useState({
   
    email: '',
   
    password: '',
    
  });

  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  const storeUserData = (userData) => {
    // Store user data in local storage
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  };


  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
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
    errorPopup: {
      marginTop: '20px',
    },
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
      const { data } = await login({ variables: { input: formData } });
      console.log('login successful:', data);

      if (data.login.role === 'patient') {
        setSuccessOpen(true); 
        storeUserData(data.login);
        setTimeout(() => {
          navigate('/patient-home', { replace: true });
        }, 1500); 
      } else if (data.login.role === 'doctor') {
        setSuccessOpen(true);
        storeUserData(data.login); 
        setTimeout(() => {
          navigate('/doctor-home', { replace: true });
        }, 1500); 
     }

    } catch (error) {
      console.error('Login failed',error);
      setErrorMessage(error.message);
      setErrorOpen(true); 
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              variant="outlined"
              style={styles.input}
            />
            <Button type="submit" style={styles.button}>
            Log In
            </Button>
          </form>
          <div style={styles.errorPopup}>
            <ErrorPopup open={errorOpen} message={errorMessage} handleClose={() => setErrorOpen(false)} />
          </div>
        </div>
      </div>
      <Snackbar
        open={successOpen}
        autoHideDuration={3000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleCloseSuccess} severity="success">
          Login Successful
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


export default Login;