import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { getProducts, getProductsByCategory, searchProducts } from '../services/productService';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let fetchedProducts: Product[];
        
        if (search) {
          setSearchQuery(search);
          fetchedProducts = await searchProducts(search);
        } else if (category) {
          setSelectedCategory(category);
          fetchedProducts = await getProductsByCategory(category);
        } else {
          fetchedProducts = await getProducts();
        }
        
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [location]);
  
  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, priceRange, searchQuery, products]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered in the useEffect
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'men', name: 'Men\'s Clothing' },
    { id: 'women', name: 'Women\'s Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'new', name: 'New Arrivals' },
    { id: 'sale', name: 'Sale' },
  ];
  
  const priceRanges = [
    { min: 0, max: 25, label: 'Under $25' },
    { min: 25, max: 50, label: '$25 - $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 1000, label: 'Over $200' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}'s Collection` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Mobile Filters Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={toggleFilters}
            leftIcon={<Filter size={16} />}
            className="w-full"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {/* Filters Sidebar */}
        <div className={`
          ${showFilters ? 'block' : 'hidden'} 
          md:block w-full md:w-64 md:mr-8 transition-all`}
        >
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id === 'all' ? '' : category.id)}
                    className={`w-full text-left px-2 py-1 rounded ${
                      (category.id === 'all' && !selectedCategory) || category.id === selectedCategory
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <ul className="space-y-2">
              {priceRanges.map((range, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePriceChange(range.min, range.max)}
                    className={`w-full text-left px-2 py-1 rounded ${
                      priceRange[0] === range.min && priceRange[1] === range.max
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any products matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange([0, 1000]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;