
🛒 App Tienda Figuras

Este proyecto desarrolla una tienda en línea funcional que permite a los usuarios explorar figuras coleccionables, gestionarlas en un carrito, realizar compras y consultar un historial de pedidos. El backend está desarrollado con Flask, usando SQLite como base de datos, e implementa autenticación con JWT. El frontend está construido con React, y consume la API utilizando Axios y navegación con React Router DOM. Este sistema simula un flujo completo de comercio electrónico y está preparado para ampliaciones futuras.

🔗 Repositorio

Repositorio del proyecto en GitHub: https://github.com/Francois00/App-TiendaFiguras

📦 Requisitos

- Python 3.10 o superior
- Node.js y npm
- Git
- pip (Python package manager)

⚙️ Instalación del Backend (Flask)

1. Clona el repositorio y entra al backend:

git clone https://github.com/Francois00/App-TiendaFiguras.git
cd App-TiendaFiguras/backend

2. Crea un entorno virtual y actívalo:

python -m venv venv
source venv/bin/activate      # En Linux/macOS
venv\Scripts\activate       # En Windows

3. Instala las dependencias una por una:

pip install flask
pip install flask_sqlalchemy
pip install flask_cors
pip install flask_jwt_extended
pip install flask_bcrypt
pip install flask_wtf

4. Crea la base de datos:

flask shell
>>> from app import db
>>> db.create_all()
>>> exit()

5. Inicia el servidor backend:

flask run

💻 Instalación del Frontend (React)

1. Ve al directorio del frontend:

cd ../frontend

2. Instala las dependencias una por una:

npm install react
npm install react-dom
npm install axios
npm install react-router-dom
npm install bootstrap

3. Inicia el servidor React:

npm start

🐚 Comandos Útiles en el Shell

- Ingresar al shell:

flask shell

- Agregar un producto:

from models import Product
from app import db

nuevo = Product(
    name="Wargreymon X",
    description="Figura Digimon articulada",
    price=79.99,
    stock=15,
    image="wargreymon_x.jpg"
)
db.session.add(nuevo)
db.session.commit()

- Consultar productos:

Product.query.all()

- Salir:

exit()

🔐 Seguridad

Se utiliza JWT para manejar sesiones autenticadas, almacenando el token en localStorage. Rutas protegidas usan el decorador @jwt_required() para asegurar acceso autorizado.

🌐 Frontend

- Framework: React
- Librerías principales: Axios, React Router DOM
- Componentes clave: Login, Register, ProductDetail, Cart, Checkout, OrderHistory
- Diseño responsivo usando CSS Grid y Flexbox
- Estados gestionados con useState, useEffect

🛠️ Backend

- Framework: Flask
- Modularidad en rutas (/auth, /cart, /products, /orders)
- Base de datos SQLite
- Seguridad con JWT
- Validación de formularios con Flask-WTF

📌 Endpoints

Usuarios
- POST /register: Registro de nuevos usuarios
- POST /login: Autenticación y obtención de JWT

Productos
- GET /products: Lista de productos
- GET /products/<id>: Detalles de producto

Carrito
- POST /cart: Añadir al carrito
- GET /cart: Consultar carrito
- POST /cart/update: Modificar cantidades
- POST /cart/delete: Eliminar producto

Pedidos
- POST /checkout: Procesar compra
- GET /orders: Consultar historial

🧾 Referencias en Formato APA

Flask Documentation. (n.d.). Flask. https://flask.palletsprojects.com
React Documentation. (n.d.). React. https://reactjs.org
JWT.io. (n.d.). Introduction to JSON Web Tokens. https://jwt.io/introduction
Axios Documentation. (n.d.). Axios. https://axios-http.com
React Router Documentation. (n.d.). React Router. https://reactrouter.com
SQLite Documentation. (n.d.). SQLite. https://www.sqlite.org/index.html
Flask-WTF Documentation. (n.d.). Flask-WTF. https://flask-wtf.readthedocs.io/

📌 Keywords

Flask, React, SQLite, JWT, Axios, e-commerce, carrito de compras, autenticación, API REST, frontend, backend

📄 Licencia

Este proyecto es de uso educativo y puede ser adaptado libremente para propósitos académicos.
