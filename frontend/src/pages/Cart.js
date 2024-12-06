import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './Cart.css';

const Cart = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Crear una instancia de useNavigate

  // Obtener los productos en el carrito
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/cart')
      .then(response => {
        setOrderItems(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos del carrito:', error);
      });
  }, []);

  // Función para actualizar la cantidad de un producto en el carrito
  const updateQuantity = (cart_item_id, new_quantity) => {
    axios.post('http://127.0.0.1:5000/cart/update', {
      cart_item_id: cart_item_id,
      quantity: new_quantity
    })
      .then(response => {
        setMessage(response.data.message);
        // Volver a cargar los productos del carrito después de la actualización
        axios.get('http://127.0.0.1:5000/cart')
          .then(response => {
            setOrderItems(response.data);
          })
          .catch(error => {
            console.error('Error al actualizar el carrito:', error);
          });
      })
      .catch(error => {
        console.error('Error al actualizar la cantidad:', error);
      });
  };

  // Función para eliminar un producto del carrito
  const removeItem = (cart_item_id) => {
    axios.post('http://127.0.0.1:5000/cart/delete', {
      cart_item_id: cart_item_id
    })
      .then(response => {
        setMessage(response.data.message);
        // Volver a cargar los productos del carrito después de eliminar
        axios.get('http://127.0.0.1:5000/cart')
          .then(response => {
            setOrderItems(response.data);
          })
          .catch(error => {
            console.error('Error al eliminar el producto del carrito:', error);
          });
      })
      .catch(error => {
        console.error('Error al eliminar el producto:', error);
      });
  };

  // Función para redirigir al checkout
  const goToCheckout = () => {
    navigate('/checkout');  // Redirige a la página de checkout
  };

  return (
    <div>
      <h2>Mi Carrito</h2>
      {message && <p>{message}</p>}
      <div className="order-items">
        {orderItems.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          orderItems.map(item => (
            <div key={item.id} className="order-item">
              <h3>{item.product_name}</h3>
              <div>
                <label>Cantidad:</label>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p>Total: ${item.total_price.toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)}>Eliminar</button>
            </div>
          ))
        )}
      </div>

      {/* Solo mostrar el botón de Checkout si el carrito tiene productos */}
      {orderItems.length > 0 && (
        <button onClick={goToCheckout} className="btn btn-primary">Continuar compra</button>
      )}
    </div>
  );
};

export default Cart;
