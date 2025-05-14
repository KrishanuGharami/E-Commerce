import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200 animate-fade-in">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
        <Link to={`/products/${item.productId}`}>
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover object-center"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col sm:flex-row sm:ml-4">
        <div className="flex-1">
          <Link 
            to={`/products/${item.productId}`}
            className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
          >
            {item.name}
          </Link>
          
          <p className="mt-1 text-sm text-gray-500">
            ${item.price.toFixed(2)} each
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>
            
            <span className="px-3 py-1 text-gray-700">
              {item.quantity}
            </span>
            
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right mt-4 sm:mt-0 sm:ml-6">
        <p className="text-lg font-medium text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;