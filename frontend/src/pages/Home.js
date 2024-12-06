import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/products') // Backend API
      .then(response => setProducts(response.data))
      .catch(error => console.log('Error al obtener productos:', error));
  }, []);

  return (
    <div>
      
      <h2>Productos Disponibles</h2>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
