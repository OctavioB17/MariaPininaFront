import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Chip, Pagination } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectUser } from '../../store/userSlice';
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter';
import axios from 'axios';
import { variables } from '../../config/variables';
import Cookies from 'js-cookie';
import { Order } from '../../interfaces/IOrders';
import IPaginationResponse from '../interfaces/IPaginationResponse';
import NormalBox from '../reusable/NormalBox';

const OrdersView: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
    console.log(orders[0])
  const fetchOrders = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get<IPaginationResponse<Order>>(
        `${variables.backendIp}/orders/find/user-id/${user.id}`,
        {
          params: { offset, limit },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setOrders(response.data.data);
      setError(null);
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id, offset]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setOffset((value - 1) * limit);
  };

  return (
    <NBoxWithHeaderAndFooter>
      <Box sx={{ padding: '2vw', display: 'flex', flexDirection: 'column', gap: '2vw' }}>
        <Typography variant="h4" sx={{ textAlign: 'left' }}>My Orders</Typography>
        
        {(loading || error) ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px', gap: 2, paddingBottom: '15vw', paddingTop: '10vw', }}>
            <CircularProgress />
            {error && (
              <>
                <CircularProgress sx={{ color: 'primary.contrastText' }}/>
              </>
            )}
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', border: '1px dotted #0d3e45', borderRadius: '10px', padding: '5vw' }}>
            <Typography>No orders found</Typography>
          </Box>
        ) : (
          <>
            {orders.map((order) => (
              <NormalBox key={order.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">Order #{order.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={order.status} 
                      color={order.status === 'COMPLETED' ? 'success' : 'primary'}
                    />
                    <Chip 
                      label={order.paymentMethod} 
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {order.products?.map((product) => (
                    <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        component="img"
                        src={''}
                        sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {product.sku}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${product.price}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Taxes:
                    </Typography>
                    {order.taxes?.map((tax, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        {tax.type}: ${tax.number.toFixed(2)}
                      </Typography>
                    ))}
                  </Box>
                  <Typography variant="h6">
                    Total: ${Number(order.totalPrice || 0).toFixed(2)}
                  </Typography>
                </Box>
              </NormalBox>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={Math.ceil(orders.length / limit)} 
                page={Math.floor(offset / limit) + 1} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </NBoxWithHeaderAndFooter>
  );
};

export default OrdersView;