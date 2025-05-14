from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import datetime
import uuid

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50))
    in_stock = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'imageUrl': self.image_url,
            'category': self.category,
            'inStock': self.in_stock
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, processing, shipped, delivered, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed
    payment_method = db.Column(db.String(20))
    shipping_address = db.Column(db.JSON, nullable=False)
    billing_address = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'totalAmount': self.total_amount,
            'status': self.status,
            'paymentStatus': self.payment_status,
            'paymentMethod': self.payment_method,
            'shippingAddress': self.shipping_address,
            'billingAddress': self.billing_address,
            'createdAt': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'productId': self.product_id,
            'name': self.name,
            'price': self.price,
            'quantity': self.quantity
        }

# Create database and tables
with app.app_context():
    db.create_all()
    
    # Add sample products if none exist
    if Product.query.count() == 0:
        sample_products = [
            {
                'name': 'Classic White T-Shirt',
                'description': 'A comfortable, everyday white t-shirt made from 100% organic cotton.',
                'price': 24.99,
                'image_url': 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
                'category': 'men',
                'in_stock': True
            },
            {
                'name': 'Black Denim Jeans',
                'description': 'Slim-fit black denim jeans with a modern cut and durable construction.',
                'price': 59.99,
                'image_url': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
                'category': 'men',
                'in_stock': True
            },
            {
                'name': 'Floral Summer Dress',
                'description': 'A lightweight, floral print dress perfect for warm summer days.',
                'price': 49.99,
                'image_url': 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
                'category': 'women',
                'in_stock': True
            },
            {
                'name': 'Leather Jacket',
                'description': 'Classic leather jacket with a modern twist. Made from genuine leather.',
                'price': 199.99,
                'image_url': 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg',
                'category': 'women',
                'in_stock': True
            },
            {
                'name': 'Silver Watch',
                'description': 'Elegant silver watch with a minimalist design and quartz movement.',
                'price': 129.99,
                'image_url': 'https://images.pexels.com/photos/9979289/pexels-photo-9979289.jpeg',
                'category': 'accessories',
                'in_stock': True
            },
            {
                'name': 'Canvas Backpack',
                'description': 'Durable canvas backpack with leather accents and multiple compartments.',
                'price': 44.99,
                'image_url': 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
                'category': 'accessories',
                'in_stock': True
            },
            {
                'name': 'Striped Sweater',
                'description': 'Warm and cozy striped sweater for cool evenings.',
                'price': 39.99,
                'image_url': 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg',
                'category': 'new',
                'in_stock': True
            },
            {
                'name': 'Leather Wallet',
                'description': 'Compact leather wallet with RFID protection and multiple card slots.',
                'price': 29.99,
                'image_url': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
                'category': 'accessories',
                'in_stock': True
            },
            {
                'name': 'Summer Hat',
                'description': 'Wide-brimmed straw hat for beach days and sunny outings.',
                'price': 19.99,
                'image_url': 'https://images.pexels.com/photos/1071162/pexels-photo-1071162.jpeg',
                'category': 'new',
                'in_stock': True
            },
            {
                'name': 'Running Shoes',
                'description': 'Lightweight running shoes with excellent cushioning and support.',
                'price': 89.99,
                'image_url': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
                'category': 'sale',
                'in_stock': True
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()

# API routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email already exists'}), 400
    
    password_hash = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=password_hash)
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'token': access_token,
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'token': access_token,
        'user': user.to_dict()
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify({
        'success': True,
        'data': [product.to_dict() for product in products]
    }), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'success': False, 'error': 'Product not found'}), 404
    
    return jsonify({
        'success': True,
        'data': product.to_dict()
    }), 200

@app.route('/api/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    products = Product.query.filter_by(category=category).all()
    
    return jsonify({
        'success': True,
        'data': [product.to_dict() for product in products]
    }), 200

@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'success': False, 'error': 'Search query is required'}), 400
    
    products = Product.query.filter(
        Product.name.ilike(f'%{query}%') | Product.description.ilike(f'%{query}%')
    ).all()
    
    return jsonify({
        'success': True,
        'data': [product.to_dict() for product in products]
    }), 200

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Create order
        new_order = Order(
            user_id=user_id,
            total_amount=data.get('totalAmount'),
            payment_method=data.get('paymentMethod'),
            shipping_address=data.get('shippingAddress'),
            billing_address=data.get('billingAddress')
        )
        
        db.session.add(new_order)
        db.session.flush()  # Get the order ID without committing
        
        # Add order items
        for item_data in data.get('items'):
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data.get('productId'),
                name=item_data.get('name'),
                price=item_data.get('price'),
                quantity=item_data.get('quantity')
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': new_order.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'success': False, 'error': 'Order not found'}), 404
    
    # Ensure user can only access their own orders
    if order.user_id != user_id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    return jsonify({
        'success': True,
        'data': order.to_dict()
    }), 200

@app.route('/api/orders/user', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'data': [order.to_dict() for order in orders]
    }), 200

@app.route('/api/orders/<int:order_id>/payment', methods=['POST'])
@jwt_required()
def process_payment(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'success': False, 'error': 'Order not found'}), 404
    
    # Ensure user can only pay for their own orders
    if order.user_id != user_id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    payment_method_id = data.get('paymentMethodId')
    
    # In a real implementation, this would integrate with Stripe or another payment processor
    # For this demo, we'll simulate a successful payment
    
    try:
        # Update order status
        order.payment_status = 'paid'
        order.status = 'processing'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'clientSecret': f'demo_secret_{uuid.uuid4()}',
                'orderId': order.id
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)