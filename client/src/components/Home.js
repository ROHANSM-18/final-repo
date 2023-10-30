import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733',
    },
  },
});

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  image: {
    width: '101%',
    height: '75vh',
    objectFit: 'cover',
  },
  logo: {
    display: 'flex',
    marginRight: '70vw',
    alignItems: 'flex-start',
  },
};

function Home() {

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Grid container direction="column" alignItems="left" justify="center" style={{ minHeight: '100vh' }}>
          <Grid item>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <div style={styles.logo}>
                  <img
                    src="https://s3u.tmimgcdn.com/800x0/u78089763/e74faf09db878750b7fada6d977dbed7.jpg"
                    alt="Logo"
                    style={{ width: '150px' }}
                  />
                </div>
              </Grid>
              <Grid item>
                <Link to="/login">
                  <Button variant="contained" color="primary" style={{ marginRight: 10 }}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="contained" color="primary">
                    Sign Up
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ width: '100%' }}>
            <img
              src="https://ayu.health/blog/wp-content/uploads/2023/03/How-to-Improve-Doctor-Patient-Communication-in-India.webp"
              alt="Background"
              style={styles.image}
            />
          </Grid>
        </Grid>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default Home;
