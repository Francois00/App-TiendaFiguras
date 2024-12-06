from flask import Blueprint, request, jsonify
from app.models import db, Order, Product
from flask_jwt_extended import jwt_required, get_jwt_identity

order_routes = Blueprint('order_routes', __name__)

@order_routes.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()
    if not orders:
        return jsonify({"message": "No orders found"}), 404

    return jsonify([{
        'order_id': order.id,
        'product_name': order.product.name,
        'quantity': order.quantity,
        'total_price': order.total_price
    } for order in orders]), 200
