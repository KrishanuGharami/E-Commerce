import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  setCardElement: React.Dispatch<React.SetStateAction<any>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  setCardElement, 
  paymentMethod, 
  setPaymentMethod 
}) => {
  
  // In a real implementation, this would use Stripe Elements
  // For this demo, we'll just simulate a card form
  
  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In real app, this would validate the card details
    // Here we'll just simulate storing the payment method
    setCardElement(e.target.value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="credit-card"
            name="payment-method"
            type="radio"
            checked={paymentMethod === 'credit_card'}
            onChange={() => setPaymentMethod('credit_card')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
            Credit Card
          </label>
        </div>
        
        {paymentMethod === 'credit_card' && (
          <div className="border border-gray-200 rounded-md p-4 mt-2 animate-fade-in">
            <div className="mb-4">
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  onChange={handleCardDetailsChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry-date"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                id="name-on-card"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            id="paypal"
            name="payment-method"
            type="radio"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
            PayPal
          </label>
        </div>
        
        {paymentMethod === 'paypal' && (
          <div className="border border-gray-200 rounded-md p-4 mt-2 animate-fade-in">
            <p className="text-sm text-gray-600">
              You will be redirected to PayPal to complete your payment.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Your payment information is securely processed. We do not store your credit card details.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;