import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tienda.db'  # Configurar la URI de la base de datos SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Desactivar las modificaciones automáticas
    SECRET_KEY = os.urandom(24)  # Clave secreta para sesiones y JWT
