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

    //TODO backend logic
    const userRole = "organizer";

    if (userRole === 'organizer') {
      login(true);
      navigate('/organizer');
    } else {
      login(false);
      navigate('/participant');
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
