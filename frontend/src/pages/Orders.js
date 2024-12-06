import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        setMessage('No se pudieron obtener los pedidos');
      });
  }, []);

  return (
    <div className="orders-container">
      <h2>Mis Pedidos</h2>
      {message && <p>{message}</p>}
      {orders.length === 0 ? (
        <p>No tienes pedidos realizados.</p>
      ) : (
        orders.map(order => (
          <div key={order.order_id} className="order">
            <h3>Pedido #{order.order_id}</h3>
            <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
            <p>Método de pago: {order.payment_method}</p>
            <h4>Productos:</h4>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.product_name} - Cantidad: {product.quantity} - Total: ${product.total_price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total de la compra: ${order.total_price.toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
