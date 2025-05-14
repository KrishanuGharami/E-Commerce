import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Sale tag */}
      {product.category === 'sale' && (
        <div className="absolute top-0 right-0 bg-accent-600 text-white text-xs font-bold px-2 py-1 z-10">
          SALE
        </div>
      )}
      
      {/* New arrival tag */}
      {product.category === 'new' && (
        <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-2 py-1 z-10">
          NEW
        </div>
      )}
      
      {/* Product image with link */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Quick add to cart overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShoppingBag size={16} />}
              onClick={handleAddToCart}
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
      
      {/* Product details */}
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          {!product.inStock && (
            <span className="text-sm font-medium text-red-600">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;