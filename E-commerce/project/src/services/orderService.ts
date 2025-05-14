import api from '../utils/api';
import { Order, OrderItem, Address, ApiResponse } from '../types';

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
  try {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data || null;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (id: number | string): Promise<Order | null> => {
  try {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data || null;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<ApiResponse<Order[]>>('/orders/user');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const processPayment = async (
  orderId: number | string, 
  paymentMethodId: string
): Promise<{ success: boolean; clientSecret?: string; error?: string }> => {
  try {
    const response = await api.post<ApiResponse<{ clientSecret: string }>>(`/orders/${orderId}/payment`, {
      paymentMethodId
    });
    
    return {
      success: true,
      clientSecret: response.data.data?.clientSecret
    };
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Payment processing failed'
    };
  }
};