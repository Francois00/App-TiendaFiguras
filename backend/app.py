from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime

# Inicializar la aplicación Flask
app = Flask(__name__)

# Configurar la base de datos (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tienda.db'  # Usando SQLite para la base de datos
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar modificaciones automáticas
app.config['JWT_SECRET_KEY'] = 'secret-key'  # Llave secreta para JWT
db = SQLAlchemy(app)  # Instancia de la base de datos

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Habilitar CORS para todo el backend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.after_request
def after_request(response):
    # Asegúrate de que la respuesta tenga los encabezados CORS adecuados
    response.headers.add('Access-Control-Allow-Origin', '*')  # Permite cualquier origen
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')  # Los headers permitidos
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')  # Métodos permitidos
    return response

# Modelo User y funciones relacionadas
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"message": "Missing required fields"}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"message": "User already exists"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"message": "Missing required fields"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.username), 200

# Modelo Product y funciones relacionadas
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    if not products:
        return jsonify({"message": "No products found"}), 404
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url
    } for product in products])

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url
    })

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    product.name = request.json.get('name', product.name)
    product.description = request.json.get('description', product.description)
    product.price = request.json.get('price', product.price)
    product.image_url = request.json.get('image_url', product.image_url)

    db.session.commit()

    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url
    }), 200

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    product = db.relationship('Product', backref='cart_items', lazy=True)


# Definir el modelo Cart
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    items = db.relationship('CartItem', backref='cart', lazy=True)

@app.route('/cart', methods=['POST'])
def add_to_cart():
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)

    # Verificar si el producto existe
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    # Recuperar o crear un carrito global
    cart = Cart.query.first()
    if not cart:
        cart = Cart()
        db.session.add(cart)
        db.session.commit()

    # Verificar si el producto ya está en el carrito
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        # Si ya está, actualiza la cantidad
        cart_item.quantity += quantity
        cart_item.total_price = cart_item.quantity * product.price
    else:
        # Si no está, agrégalo al carrito
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, product_name=product.name,
                             quantity=quantity, total_price=product.price * quantity)
        db.session.add(cart_item)

    db.session.commit()

    return jsonify({"message": "Product added to cart"}), 200

# Ruta para obtener todos los productos en el carrito
@app.route('/cart', methods=['GET'])
def get_cart():
    cart = Cart.query.first()  # Suponemos que solo hay un carrito global
    if not cart:
        return jsonify({"message": "Cart is empty"}), 404

    # Obtenemos todos los productos dentro del carrito
    items = CartItem.query.filter_by(cart_id=cart.id).all()
    cart_items = [{
        'id': item.id,
        'product_name': item.product.name,  # Usamos la relación para obtener el nombre del producto
        'quantity': item.quantity,
        'total_price': item.total_price
    } for item in items]

    return jsonify(cart_items), 200


# Ruta para actualizar la cantidad de un producto en el carrito
@app.route('/cart/update', methods=['POST'])
def update_cart():
    cart_item_id = request.json.get('cart_item_id')  # ID del item en el carrito
    new_quantity = request.json.get('quantity')  # Nueva cantidad

    if new_quantity < 1:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    cart_item = CartItem.query.get(cart_item_id)  # Buscar el item del carrito
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    # Actualizar la cantidad y el total
    cart_item.quantity = new_quantity
    cart_item.total_price = cart_item.quantity * cart_item.product.price  # Recalcular el precio total

    db.session.commit()

    return jsonify({"message": "Cart item updated successfully"}), 200

# Ruta para eliminar un producto del carrito
@app.route('/cart/delete', methods=['POST'])
def delete_item():
    cart_item_id = request.json.get('cart_item_id')  # ID del item en el carrito
    cart_item = CartItem.query.get(cart_item_id)  # Buscar el item del carrito
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    db.session.delete(cart_item)  # Eliminar el item del carrito
    db.session.commit()

    return jsonify({"message": "Cart item deleted successfully"}), 200

from datetime import datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', backref=db.backref('order_items', lazy=True))


from datetime import datetime

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()

    # Obtener datos básicos del pedido
    payment_method = data.get('payment_method')
    name = data.get('name')
    address = data.get('address')
    products = data.get('products', [])

    if not payment_method or not name or not address or not products:
        return jsonify({"message": "Faltan datos en la solicitud"}), 400

    # Calcular el precio total del pedido
    total_price = sum([item['total_price'] for item in products])

    # Crear el pedido en la base de datos
    order = Order(
        name=name,
        address=address,
        payment_method=payment_method,
        total_price=total_price
    )
    db.session.add(order)
    db.session.commit()

    # Registrar los productos en la tabla OrderItem
    for product in products:
        order_item = OrderItem(
            order_id=order.id,
            product_name=product['product_name'],
            quantity=product['quantity'],
            total_price=product['total_price']
        )
        db.session.add(order_item)

    db.session.commit()

    # Limpiar el carrito después de finalizar la compra
    CartItem.query.delete()
    db.session.commit()

    # Responder con la información del pedido
    order_data = {
        "name": order.name,
        "address": order.address,
        "payment_method": order.payment_method,
        "total": order.total_price,
        "products": [
            {
                "product_name": item.product_name,
                "quantity": item.quantity,
                "total_price": item.total_price
            } for item in order.order_items
        ]
    }

    return jsonify({"message": "Compra realizada con éxito", "order": order_data}), 201











@app.route('/orders', methods=['GET'])
def get_orders():
    # Recuperar todos los pedidos de la base de datos
    orders = Order.query.all()

    if not orders:
        return jsonify({"message": "No hay pedidos registrados"}), 404

    orders_data = []
    for order in orders:
        orders_data.append({
            'id': order.id,
            'name': order.name,
            'address': order.address,
            'payment_method': order.payment_method,
            'total_price': order.total_price,
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'products': [
                {
                    'product_name': item.product_name,
                    'quantity': item.quantity,
                    'total_price': item.total_price
                } for item in order.order_items
            ]
        })

    return jsonify(orders_data), 200





# Ruta para actualizar la cantidad de un producto en la orden
@app.route('/orders/update', methods=['POST'])
def update_order():
    order_id = request.json.get('order_id')
    new_quantity = request.json.get('quantity')

    if new_quantity < 1:
        return jsonify({"message": "La cantidad no puede ser menor que 1"}), 400
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    
    # Calcular el nuevo precio total
    order.quantity = new_quantity
    order.total_price = order.quantity * 29.99  # Suponiendo que el precio del producto es 29.99
    
    db.session.commit()
    
    return jsonify({"message": "Order updated successfully"}), 200

# Ruta para eliminar una orden
@app.route('/orders/delete', methods=['POST'])
def delete_order():
    order_id = request.json.get('order_id')
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
    
    db.session.delete(order)
    db.session.commit()
    
    return jsonify({"message": "Order deleted successfully"}), 200




# Crear las tablas si no existen
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
