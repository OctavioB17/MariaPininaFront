import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Divider, Chip, Pagination, useMediaQuery } from '@mui/material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectUser } from '../../store/userSlice';
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter';
import axios from 'axios';
import { variables } from '../../config/variables';
import Cookies from 'js-cookie';
import { Order } from '../../interfaces/IOrders';
import IPaginationResponse from '../interfaces/IPaginationResponse';
import NormalBox from '../reusable/NormalBox';
import { theme } from '../../config/ThemeConfig';

const OrdersView: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAppSelector(selectUser);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchOrders = useCallback(async () => {
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
  }, [user?.id, offset, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setOffset((value - 1) * limit);
  };

  return (
    <NBoxWithHeaderAndFooter>
      <Box sx={{ 
        padding: isMobile ? '4vw' : '2vw', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? '4vw' : '2vw' 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'left',
            fontSize: isMobile ? '6vw' : '2.5vw'
          }}
        >
          My Orders
        </Typography>
        
        {(loading || error) ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px', 
            gap: isMobile ? '4vw' : 2, 
            paddingBottom: isMobile ? '30vw' : '15vw', 
            paddingTop: isMobile ? '20vw' : '10vw' 
          }}>
            <CircularProgress />
            {error && (
              <>
                <CircularProgress sx={{ color: 'primary.contrastText' }}/>
              </>
            )}
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? '10vw' : 3, 
            textAlign: 'center', 
            border: '1px dotted #0d3e45', 
            borderRadius: '10px' 
          }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
              No orders found
            </Typography>
          </Box>
        ) : (
          <>
            {orders.map((order) => (
              <NormalBox key={order.id}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: isMobile ? 'flex-start' : 'center', 
                  mb: isMobile ? '4vw' : 2,
                  gap: isMobile ? '2vw' : 0
                }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}
                    >
                      Order #{order.id}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: isMobile ? '2vw' : 1,
                    flexWrap: 'wrap'
                  }}>
                    <Chip 
                      label={order.status} 
                      color={order.status === 'COMPLETED' ? 'success' : 'primary'}
                      sx={{ 
                        fontSize: isMobile ? '3.5vw' : 'inherit',
                        height: isMobile ? '8vw' : 'inherit'
                      }}
                    />
                    <Chip 
                      label={order.paymentMethod} 
                      variant="outlined"
                      sx={{ 
                        fontSize: isMobile ? '3.5vw' : 'inherit',
                        height: isMobile ? '8vw' : 'inherit'
                      }}
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: isMobile ? '4vw' : 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4vw' : 2 }}>
                  {order.products?.map((product) => (
                    <Box key={product.id} sx={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center', 
                      gap: isMobile ? '2vw' : 2 
                    }}>
                      <Box 
                        component="img"
                        src={product.imageGallery[0]}
                        sx={{ 
                          width: isMobile ? '60vw' : 100, 
                          height: isMobile ? '60vw' : 100, 
                          objectFit: 'cover', 
                          borderRadius: 1, 
                          border: '1px solid #0d3e45' 
                        }}
                      />
                      <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        gap: isMobile ? '2vw' : 0
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}
                        >
                          {product.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}
                        >
                          SKU: {product.sku}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}
                        >
                          Price: ${product.price}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}
                        >
                          Quantity: {product.quantity}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="subtitle1"
                        sx={{ 
                          fontSize: isMobile ? '4vw' : 'inherit',
                          alignSelf: isMobile ? 'flex-end' : 'center'
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: isMobile ? '4vw' : 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? '4vw' : 0
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: isMobile ? '2vw' : 0
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}
                    >
                      Taxes:
                    </Typography>
                    {order.taxes?.map((tax, index) => (
                      <Typography 
                        key={index} 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}
                      >
                        {tax.type
                          .replace(/([A-Z])/g, ' $1')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')}: ${tax.number.toFixed(2)}
                      </Typography>
                    ))}
                  </Box>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: isMobile ? '5vw' : 'inherit',
                      alignSelf: isMobile ? 'flex-end' : 'center'
                    }}
                  >
                    Total: ${Number(order.totalPrice || 0).toFixed(2)}
                  </Typography>
                </Box>
              </NormalBox>
            ))}

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: isMobile ? '4vw' : 2 
            }}>
              <Pagination 
                count={Math.ceil(orders.length / limit)} 
                page={Math.floor(offset / limit) + 1} 
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: isMobile ? '4vw' : 'inherit'
                  }
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </NBoxWithHeaderAndFooter>
  );
};

export default OrdersView;