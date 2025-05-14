import React from 'react';
import { useCartStore } from '../store/cartStore';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ShoppingCart } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { items, totalAmount } = useCartStore();
  
  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.07; // 7% tax rate
  const orderTotal = totalAmount + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            You need to add items to your cart before proceeding to checkout.
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex py-3 border-b border-gray-200 last:border-0">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
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
              
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p className="mb-1">
                By placing your order, you agree to our 
                <Link to="/terms" className="text-primary-600 hover:text-primary-800"> Terms and Conditions</Link> and 
                <Link to="/privacy" className="text-primary-600 hover:text-primary-800"> Privacy Policy</Link>.
              </p>
              <p>
                All payments are secure and encrypted. We do not store your credit card information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;