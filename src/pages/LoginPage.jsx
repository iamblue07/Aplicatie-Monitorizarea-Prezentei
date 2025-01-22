import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Trimite cererea de autentificare la backend
    try {
      const response = await fetch('http://localhost:3000/api/participanti/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, parola: password }), // Trimite email și parola
      });

      if (!response.ok) {
        throw new Error('Email sau parolă incorectă');
      }

      const data = await response.json();

      // Verifică dacă utilizatorul este un organizator
      const userRole = data.esteOrganizer ? 'organizer' : 'participant';
      console.log("User ID:", data.id_participant);

      if (userRole === 'organizer') {
        login(userRole === 'organizer', data.id_participant);
        navigate('/organizer');
      } else {
        login(userRole === 'organizer', data.id_participant);
        navigate('/participant');
      }
    } catch (error) {
      alert(error.message); // Afișează eroarea
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Conectează-te</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="login-button">Conectează-te</button>
      </form>
    </div>
  );
};

export default LoginPage;
