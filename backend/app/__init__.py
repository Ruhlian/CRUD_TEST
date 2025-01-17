from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS

    # Registrar las rutas
    from .routes.productos import productos_bp
    app.register_blueprint(productos_bp)

    return app
