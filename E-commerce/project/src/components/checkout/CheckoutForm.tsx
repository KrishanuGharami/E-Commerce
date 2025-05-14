import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { createOrder, processPayment } from '../../services/orderService';
import Button from '../ui/Button';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import { Address } from '../../types';

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [billingInfo, setBillingInfo] = useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardElement, setCardElement] = useState<any>(null);
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingInfo, setShippingInfo] = useState<Address | null>(null);

  // Validate based on current step
  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      const { firstName, lastName, street, city, state, zipCode } = billingInfo;
      if (!firstName || !lastName || !street || !city || !state || !zipCode) {
        setError('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (!cardElement) {
        setError('Please enter valid payment information');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create the shipping address (same as billing if checkbox is checked)
      const shipping = sameAsShipping ? billingInfo : (shippingInfo as Address);

      // Step 1: Create the order
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        totalAmount,
        shippingAddress: shipping,
        billingAddress: billingInfo,
        paymentMethod,
      };

      const order = await createOrder(orderData);

      if (!order) {
        throw new Error('Failed to create order');
      }

      // Step 2: Process payment (using Stripe or dummy processor)
      // Here we're passing the card element from the PaymentForm
      const { success, error } = await processPayment(order.id, cardElement);

      if (!success) {
        throw new Error(error || 'Payment processing failed');
      }

      // Clear cart and navigate to success page
      clearCart();
      navigate(`/orders/${order.id}`);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Checkout</h2>
        <div className="mt-4 flex items-center">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Billing</span>
          </div>
          <div className={`flex-1 h-px mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <BillingForm
            billingInfo={billingInfo}
            setBillingInfo={setBillingInfo}
            sameAsShipping={sameAsShipping}
            setSameAsShipping={setSameAsShipping}
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
          />
        )}
        
        {step === 2 && (
          <div className="animate-fade-in">
            <PaymentForm 
              setCardElement={setCardElement}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
            >
              Back
            </Button>
          )}
          
          {step < 2 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              leftIcon={<CreditCard size={18} />}
              isLoading={isLoading}
              className="ml-auto"
            >
              Complete Order
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;