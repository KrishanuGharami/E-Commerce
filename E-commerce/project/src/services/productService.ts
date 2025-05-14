import api from '../utils/api';
import { Product, ApiResponse } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: number | string): Promise<Product | null> => {
  try {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error searching products with query ${query}:`, error);
    return [];
  }
};