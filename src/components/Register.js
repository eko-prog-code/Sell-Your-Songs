import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from './firebase'; // Mengimpor `auth` dari firebase.js
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import './Register.css';

const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noTelpon, setNoTelpon] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase(); // Menginisialisasi database

        // Simpan data pengguna tambahan ke Realtime Database
        set(ref(db, 'users/' + user.uid), {
          nama,
          email,
          noTelpon,
          uid: user.uid
        });

        alert('Registration successful! Redirecting to home page.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error registering:', error);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="No Telpon WhatsApp"
          value={noTelpon}
          onChange={(e) => setNoTelpon(e.target.value)}
          required
        />
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? "🙊" : "🙈"}
          </span>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Register;
