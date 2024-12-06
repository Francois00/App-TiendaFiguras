from flask import Blueprint, request, jsonify
from app.models import db, Cart, CartItem, Product
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_routes = Blueprint('cart_routes', __name__)

@cart_routes.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
        cart_item.total_price = cart_item.quantity * product.price
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity, total_price=product.price * quantity)
        db.session.add(cart_item)

    db.session.add(cart)
    db.session.commit()

    return jsonify({"message": "Product added to cart"}), 200
