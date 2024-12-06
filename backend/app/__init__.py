from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Instancia de base de datos y JWT
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Cargar la configuración
    app.config.from_object('app.instance.config.Config')

    # Inicializar las extensiones
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)  # Habilitar CORS

    # Importar y registrar los blueprints
    from app.routes.auth_routes import auth_routes
    from app.routes.cart_routes import cart_routes
    from app.routes.order_routes import order_routes
    from app.routes.product_routes import product_routes

    app.register_blueprint(auth_routes)
    app.register_blueprint(cart_routes)
    app.register_blueprint(order_routes)
    app.register_blueprint(product_routes)

    return app
