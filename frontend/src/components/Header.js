import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [username, setUsername] = useState('');

  // Intentar obtener el token desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
        setUsername(decodedToken.sub); // Asumimos que 'sub' es el nombre de usuario
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUsername('');
    window.location.href = '/'; // Redirigir a la página de inicio
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        {/* Navegación izquierda */}
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <li><Link to="/" style={styles.navItem}>Inicio</Link></li>
            <li><Link to="/cart" style={styles.navItem}>Carrito</Link></li>
            <li><Link to="/order-history" style={styles.navItem}>Historial de Pedidos</Link></li>
          </ul>
        </nav>

        {/* Título centrado */}
        <h1 style={styles.title}>Mi Tienda de Figuras</h1>

        {/* Sección derecha */}
        <div style={styles.userSection}>
          {username ? (
            <>
              <span style={styles.welcomeMessage}>Bienvenido, {username}</span>
              <button onClick={handleLogout} style={styles.logoutButton}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navItem}>Iniciar sesión</Link>
              <Link to="/register" style={styles.navItem}>Registrarse</Link>
              
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '60px', // Define una altura fija para el encabezado
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0 20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '15px',
    fontSize: '16px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  welcomeMessage: {
    color: 'white',
    marginRight: '10px',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Header;
