import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [form, setForm] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Obtener productos del carrito
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/cart')
      .then(response => setOrderItems(response.data))
      .catch(error => console.error('Error al obtener el carrito:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      payment_method: paymentMethod,
      name: form.name,
      address: form.address,
      products: orderItems.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        total_price: item.total_price,
      })),
    };

    axios.post('http://127.0.0.1:5000/checkout', orderData)
      .then(response => navigate('/confirmation', { state: { order: response.data.order } }))
      .catch(error => {
        console.error('Error al procesar la compra:', error);
        setMessage('Error al procesar la compra');
      });
  };

  return (
    <div className="checkout-container">
      <h2>Detalles de la Compra</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Método de Pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Seleccionar método</option>
            <option value="credit-card">Tarjeta de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Pago Contra Entrega</option>
          </select>
        </div>
        <div className="products">
          <h3>Productos:</h3>
          <ul>
            {orderItems.map(item => (
              <li key={item.id}>
                {item.product_name} (Cantidad: {item.quantity}) - ${item.total_price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <p>Total: ${orderItems.reduce((acc, item) => acc + item.total_price, 0).toFixed(2)}</p>
        <button type="submit" className="btn btn-primary">Finalizar compra</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Checkout;
