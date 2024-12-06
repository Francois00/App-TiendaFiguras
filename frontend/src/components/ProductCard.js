import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>
      <img 
        src={`/images/${product.image_url}`} 
        alt={product.name} 
        style={styles.image} // Estilo para limitar el tamaño de la imagen
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <Link to={`/product/${product.id}`} style={styles.link}>Ver detalles</Link>
    </div>
  );
};

// Estilos en línea para el componente
const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '8px',
    width: '250px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
  },
  image: {
    width: '100%',  // La imagen se adapta al ancho de la tarjeta
    height: '200px',  // Limitar la altura de la imagen
    objectFit: 'cover',  // Asegura que la imagen mantenga la proporción sin deformarse
    borderRadius: '8px',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: '10px',
    display: 'inline-block',
  },
};

export default ProductCard;
