import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Realizar la solicitud GET a la API para obtener los productos
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        console.log(response.data); // Ver los datos en la consola para depurar
        setProducts(response.data); // Establecer los productos recibidos en el estado
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Productos</h2>
      <div className="row">
        {/* Verifica si hay productos para mostrar */}
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p> // Mensaje si no hay productos
        ) : (
          products.map(product => (
            <div key={product.id} className="col-md-4">
              <div className="card">
                <img src={product.image_url} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">${product.price}</p>
                  <button className="btn btn-primary">Ver detalles</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;

