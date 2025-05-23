import { useState } from 'react';
import axios from 'axios';
import { variables } from '../config/variables';
import { OrderData } from '../interfaces/IOrders';
import Cookies from 'js-cookie';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData: OrderData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${variables.backendIp}/orders/create`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      setLoading(false);
      return { success: true, message: 'Order created successfully', data: response.data };
    } catch {
      setLoading(false);
      return { success: false, message: 'Failed to create order' };
    }
  };

  return {
    createOrder,
    loading,
  };
}; 