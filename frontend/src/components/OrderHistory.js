import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  // Obtener el historial de pedidos
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el historial de pedidos:', error);
        setMessage('No se pudo cargar el historial de pedidos');
      });
  }, []);

  return (
    <div className="order-history-container">
      <h2>Historial de Pedidos</h2>
      {message && <p>{message}</p>}
      {orders.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-item">
            <h3>Pedido #{order.id}</h3>
            <p><strong>Nombre:</strong> {order.name}</p>
            <p><strong>Dirección:</strong> {order.address}</p>
            <p><strong>Método de Pago:</strong> {order.payment_method}</p>
            <p><strong>Fecha:</strong> {order.created_at}</p>
            <p><strong>Total:</strong> ${order.total_price.toFixed(2)}</p>
            <h4>Productos:</h4>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.product_name} (Cantidad: {product.quantity}) - Total: ${product.total_price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
