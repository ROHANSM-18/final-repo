import React from 'react';
import Signup from './components/signUp';
import Login from './components/Login';
import PatientHome from './components/patientHome';
import DoctorHome from './components/doctorHome';
import Home from './components/Home';
import { ApolloProvider } from '@apollo/client';
import client from './client';
import Vitals from './components/vitals';
import MedicalHistory from './components/medicalhistory';
import VisitAppointments from './components/visitappointment';
import DoctorDetails from './components/doctorDetails'
import DoctorVitals from  './components/doctorVitals'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import DoctorMedical from './components/doctormedicalhistory';
import DoctorAppointments from './components/doctorappointments';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/doctor-home' element={<DoctorHome/>}/>
          <Route path='/patient-home' element={<PatientHome/>}/>
          <Route path='/vitals' element={<Vitals/>}/>
          <Route path='/medical-history' element={<MedicalHistory/>}/>
          <Route path='/appointments' element={<VisitAppointments/>}/>
          <Route path='/doctor-details' element={<DoctorDetails/>}/>
          <Route path='/doctor-vitals' element={<DoctorVitals/>}/>
          <Route path='/doctor-medical' element={<DoctorMedical/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>

          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;