import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Share, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getProductById, getProductsByCategory } from '../services/productService';
import { Product } from '../types';
import Button from '../components/ui/Button';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductById(id);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Fetch related products from the same category
          const related = await getProductsByCategory(fetchedProduct.category);
          // Filter out the current product
          setRelatedProducts(
            related.filter(item => item.id !== fetchedProduct.id).slice(0, 4)
          );
        } else {
          // Product not found
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
    }
  };
  
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // In a real app, this would call an API to add/remove from wishlist
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      alert('Sharing functionality is not available in your browser');
    }
  };
  
  // Mock product images array (in a real app, this would come from the API)
  const productImages = product ? [
    product.imageUrl,
    // Additional images would come from the API
    'https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg',
    'https://images.pexels.com/photos/5858097/pexels-photo-5858097.jpeg',
  ] : [];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
            <img
              src={productImages[activeImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex space-x-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  activeImage === index ? 'border-primary-600' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < 4 ? 'currentColor' : 'none'}
                  className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm">4.2 (24 reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>
          
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
            <div className="flex space-x-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
            <div className="flex space-x-2">
              {['bg-black', 'bg-gray-500', 'bg-blue-600', 'bg-red-600'].map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 ${color} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                ></button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                className="w-10 h-10 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center text-gray-700">{quantity}</span>
              <button
                type="button"
                className="w-10 h-10 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              fullWidth
              leftIcon={<ShoppingBag size={18} />}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-md border ${
                isInWishlist 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-gray-300 text-gray-600'
              } hover:border-primary-600 hover:text-primary-600 transition-colors`}
            >
              <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-md border border-gray-300 text-gray-600 hover:border-primary-600 hover:text-primary-600 transition-colors"
            >
              <Share size={20} />
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="text-gray-600 mr-3" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Free Shipping</h4>
                <p className="text-xs text-gray-600">Free standard shipping on orders over $100</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ShieldCheck className="text-gray-600 mr-3" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
                <p className="text-xs text-gray-600">Your payment information is processed securely</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <RefreshCw className="text-gray-600 mr-3" size={20} />
              <div>
                <h4 className="text-sm font-medium text-gray-900">30 Days Return</h4>
                <p className="text-xs text-gray-600">Simply return it within 30 days for an exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;