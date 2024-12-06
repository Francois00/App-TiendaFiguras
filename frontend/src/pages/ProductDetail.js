import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';  // Asegúrate de importar el archivo CSS

function ProductDetail() {
  const { id } = useParams();  // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);

  // Obtener detalles del producto desde el backend
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del producto:', error);
      });
  }, [id]);

  const addToCart = () => {
    if (!product?.id) {
      alert("Producto no válido");
      return;
    }
  
    axios.post('http://127.0.0.1:5000/cart', {
      product_id: product.id, 
      quantity: 1,
    })
    .then(response => {
      alert('Producto añadido al carrito');
    })
    .catch(error => {
      console.error('Error al agregar al carrito:', error);
      alert('Error al añadir el producto al carrito');
    });
  };
  

  // Mientras carga los datos
  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container">
      <h2 className="my-4">{product.name}</h2>
      <div className="row product-detail">
        <div className="col-md-6">
          <img
            src={product.image_url ? `/images/${product.image_url}` : product.image_url} // Se ajusta la URL de la imagen
            alt={product.name}
            className="product-image"  // Usamos la clase de CSS para la imagen
          />
        </div>
        <div className="col-md-6 product-info">
          <h4>Descripción</h4>
          <p>{product.description}</p>
          <p><strong>Precio: </strong>${product.price}</p>
          <button onClick={addToCart} className="btn btn-success">Añadir al carrito</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
