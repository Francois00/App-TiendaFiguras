import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Importamos el archivo CSS

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:5000/register', {
        username,
        password,
      });
      setMessage('Usuario registrado con éxito');
    } catch (error) {
      setMessage('Error al registrar el usuario');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
        </div>
        <button type="submit" className="register-button">Registrar</button>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default Register;
