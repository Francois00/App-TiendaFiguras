import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={styles.container}>
        <h2 style={styles.errorText}>No se encontró información del pedido</h2>
        <button style={styles.button} onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>¡Compra realizada con éxito!</h2>
      <div style={styles.orderSummary}>
        <h3 style={styles.sectionTitle}>Detalles del Pedido</h3>
        <p><strong>Nombre:</strong> {order.name}</p>
        <p><strong>Dirección:</strong> {order.address}</p>
        <p><strong>Método de Pago:</strong> {order.payment_method}</p>
        <h4 style={styles.sectionTitle}>Productos:</h4>
        <ul style={styles.productList}>
          {order.products.map((product, index) => (
            <li key={index} style={styles.productItem}>
              {product.product_name} (Cantidad: {product.quantity}) - Total: ${product.total_price.toFixed(2)}
            </li>
          ))}
        </ul>
        <p><strong>Total de la Compra:</strong> ${order.total.toFixed(2)}</p>
      </div>
      <button style={styles.button} onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  errorText: {
    textAlign: 'center',
    color: '#e74c3c',
  },
  orderSummary: {
    marginBottom: '20px',
  },
  sectionTitle: {
    marginTop: '10px',
    color: '#555',
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
    margin: '10px 0',
  },
  productItem: {
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '20px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Confirmation;
