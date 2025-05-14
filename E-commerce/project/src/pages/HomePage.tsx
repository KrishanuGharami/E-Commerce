import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        
        // Simulate featured products (first 4)
        setFeaturedProducts(products.slice(0, 4));
        
        // Simulate new arrivals (next 4)
        setNewArrivals(products.slice(4, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-center bg-cover" style={{ 
          backgroundImage: `url(https://images.pexels.com/photos/5895888/pexels-photo-5895888.jpeg)`,
          filter: 'brightness(0.5)'
        }}></div>
        
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover the Latest in Fashion
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Shop our new arrivals and find your perfect style. Quality meets comfort in every piece.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products">
                <Button size="lg" rightIcon={<ShoppingBag size={20} />}>
                  Shop Now
                </Button>
              </Link>
              <Link to="/products?category=new">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg"
                alt="Men's Collection"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="text-xl text-white font-bold">Men's Collection</h3>
                  <Link
                    to="/products?category=men"
                    className="inline-block mt-2 text-white hover:text-primary-200 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
                alt="Women's Collection"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="text-xl text-white font-bold">Women's Collection</h3>
                  <Link
                    to="/products?category=women"
                    className="inline-block mt-2 text-white hover:text-primary-200 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg"
                alt="Accessories"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="text-xl text-white font-bold">Accessories</h3>
                  <Link
                    to="/products?category=accessories"
                    className="inline-block mt-2 text-white hover:text-primary-200 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="mt-4 md:mt-0 flex items-center text-primary-600 hover:text-primary-800 transition-colors"
            >
              View All Products
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/products?category=new"
              className="mt-4 md:mt-0 flex items-center text-primary-600 hover:text-primary-800 transition-colors"
            >
              View All New Arrivals
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I absolutely love the quality of clothes from StyleShop. The fabrics are premium and the fit is perfect. Will definitely shop here again!"
              </p>
              <p className="font-semibold">- Sarah M.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Fast shipping and excellent customer service! When I had an issue with my order, they resolved it immediately. Great shopping experience."
              </p>
              <p className="font-semibold">- James L.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The summer collection is amazing! I've received so many compliments on my new dress. The styles are trendy yet timeless."
              </p>
              <p className="font-semibold">- Emma K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-3xl font-bold mb-2">Stay Updated</h2>
              <p className="text-primary-100">
                Subscribe to our newsletter to receive updates on new arrivals, special offers, and styling tips.
              </p>
            </div>
            
            <div className="w-full md:w-1/2 md:max-w-md">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 rounded-l-md"
                />
                <button
                  type="submit"
                  className="bg-accent-500 px-4 py-3 text-white font-medium hover:bg-accent-600 transition-colors rounded-r-md"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs mt-2 text-primary-200">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;