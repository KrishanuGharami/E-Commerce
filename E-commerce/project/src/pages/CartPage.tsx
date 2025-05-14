import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCartStore();
  
  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.07; // 7% tax rate
  const orderTotal = totalAmount + shippingCost + tax;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Cart Items ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div className="p-6" key={item.id}>
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                
                <Link to="/products">
                  <Button variant="ghost">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <Link to="/checkout">
                  <Button
                    fullWidth
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>We accept:</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-6 w-auto" />
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="MasterCard" className="h-6 w-auto" />
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" className="h-6 w-auto" />
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="American Express" className="h-6 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;