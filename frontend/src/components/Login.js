import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importamos el archivo de estilos CSS

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      });

      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('userId', response.data.user_id);

      setToken(response.data.access_token);
      setMessage('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      setMessage('Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>
      {message && <p className="login-message">{message}</p>}

      {token && <p className="login-token">Token JWT: {token}</p>}
    </div>
  );
}

export default Login;
