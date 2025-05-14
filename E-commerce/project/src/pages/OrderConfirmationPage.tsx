import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Calendar, ArrowRight } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { Order } from '../types';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const fetchedOrder = await getOrderById(id);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/profile">
          <Button>View Your Orders</Button>
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const estimatedDelivery = () => {
    const createdDate = new Date(order.createdAt);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Assume 5 days for delivery
    
    return formatDate(deliveryDate.toISOString());
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold">{`#${order.id}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Order Progress */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                <div className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Confirmed</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <Package size={20} />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Processing</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <Truck size={20} />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Shipped</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <Home size={20} />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Delivered</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Estimated delivery: {estimatedDelivery()}</span>
            </div>
          </div>
          
          {/* Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Shipping & Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-medium">{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              <div className="bg-gray-50 rounded p-4">
                <p className="font-medium">{`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</p>
                <p>{order.billingAddress.street}</p>
                <p>{`${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}`}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="bg-gray-50 rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{order.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button rightIcon={<ArrowRight size={16} />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>Need help with your order? <Link to="/contact" className="text-primary-600 hover:text-primary-800">Contact our support team</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;