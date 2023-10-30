const User = require('../../models/users'); 
const Doctor = require('../../models/doctors');
const Patient = require('../../models/patients');
require('dotenv').config()

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const signup = async (_, { input }) => {
  const { firstName, lastName, email, dateOfBirth, gender, contactInformation, password, role } = input;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
  });

  if (role === 'doctor') {
    const doctor = await Doctor.create(
      { DoctorID: 'D00' + user.id,
       FirstName: firstName,
        LastName: lastName,
        DateOfBirth:dateOfBirth ,
        Gender : gender, 
        ContactInformation:contactInformation,
         user_id: user.id 
      });
    await doctor.setUser(user);
  } else {
    const patient = await Patient.create({ PatientID: 'P00' + user.id, FirstName: firstName, LastName: lastName, DateOfBirth:dateOfBirth , Gender : gender, ContactInformation:contactInformation,user_id: user.id });
    await patient.setUser(user);
  }

  return user;
  const token = generateToken(user);
  return { token, user };
};

const login = async (_, { input }) => {
  const { email, password } = input;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Incorrect password');
  }

  return user;
  const token = generateToken(user);
  return { token, user };
};

module.exports = {
  signup,
  login,
};
