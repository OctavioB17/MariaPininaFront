import { Box, Typography, Button, Divider, IconButton, CircularProgress, Snackbar, Alert, useMediaQuery } from '@mui/material'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { useCart } from '../../../hooks/useCart'
import { useOrders } from '../../../hooks/useOrders'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import NormalBox from '../../reusable/NormalBox'
import { useState } from 'react'
import { IOrder } from '../../../interfaces/ICart'
import { IOrderItem } from '../../../interfaces/IOrders'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { theme } from '../../../config/ThemeConfig'

const CartDetail = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { orders, removeItem, updateItemQuantity, getTotalAmount, clearCart, clearOrder } = useCart()
  const { createOrder, loading } = useOrders()
  const navigate = useNavigate()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const handleQuantityChange = (sellerId: string, productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      updateItemQuantity(sellerId, productId, newQuantity)
    }
  }

  const handleCheckout = async (orderToCheckout?: IOrder) => {
    try {
      if (orderToCheckout) {
        const orderData = {
          order: {
            paymentMethod: 'CREDIT_CARD'
          },
          orderHasProducts: orderToCheckout.items.map((item: IOrderItem) => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        }

        const result = await createOrder(orderData)
        if (result.success) {
          clearOrder(orderToCheckout.sellerId)
          setSnackbarMessage('Order created successfully')
          setSnackbarSeverity('success')
        } else {
          setSnackbarMessage('Failed to create order')
          setSnackbarSeverity('error')
        }
      } else {
        let allSuccessful = true
        for (const order of orders) {
          const orderData = {
            order: {
              paymentMethod: 'CREDIT_CARD'
            },
            orderHasProducts: order.items.map(item => ({
              productId: item.product.id,
              quantity: item.quantity
            }))
          }

          const result = await createOrder(orderData)
          if (!result.success) {
            allSuccessful = false
            break
          }
        }

        if (allSuccessful) {
          clearCart()
          setSnackbarMessage('All orders created successfully')
          setSnackbarSeverity('success')
        } else {
          setSnackbarMessage('Failed to create some orders')
          setSnackbarSeverity('error')
        }
      }
      setSnackbarOpen(true)
    } catch {
      setSnackbarMessage('An error occurred while creating orders')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

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
            fontSize: isMobile ? '6vw' : '3vw'
          }}
        >
          Shopping Cart
        </Typography>
        
        {orders.length === 0 ? (
          <Box sx={{
            border: '1px dotted #0d3e45', 
            borderRadius: '8px', 
            padding: isMobile ? '30vw' : '20vw',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '4vw' : '2vw',
            alignItems: 'center'
          }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
              Your cart is empty
            </Typography>
            <Button 
              onClick={() => navigate('/products')} 
              sx={{ 
                color: 'primary.contrastText', 
                textDecoration: 'underline', 
                fontSize: isMobile ? '4vw' : '1.5vw' 
              }}
            >
              Go shopping!
            </Button>
          </Box>
        ) : (
          orders.map((order) => (
            <NormalBox key={order.sellerId} sx={{ 
              borderRadius: '8px', 
              padding: isMobile ? '4vw' : '1vw' 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  marginBottom: isMobile ? '4vw' : '1vw', 
                  textAlign: 'left',
                  fontSize: isMobile ? '5vw' : 'inherit'
                }}
              >
                Order from {order.sellerName}
              </Typography>
              <Divider sx={{ 
                margin: isMobile ? '4vw 0' : '1vw 0', 
                borderColor: 'primary.contrastText', 
                border: '1px solid' 
              }} />
              {order.items.map((item) => (
                <Box key={item.product.id} sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center', 
                  gap: isMobile ? '4vw' : '1vw', 
                  marginBottom: isMobile ? '4vw' : '1vw', 
                  justifyContent: 'space-between', 
                  textAlign: 'left' 
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center', 
                    gap: isMobile ? '4vw' : '1vw',
                    width: isMobile ? '100%' : 'auto'
                  }}>
                    <Box 
                      component="img"
                      src={item.product.imageGallery[0]}
                      sx={{ 
                        width: isMobile ? '60vw' : '100px', 
                        height: isMobile ? '60vw' : '100px', 
                        objectFit: 'cover', 
                        border: '1px solid #0d3e45' 
                      }}
                    />
                  
                    <Box sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: isMobile ? '2vw' : '0.5vw'
                    }}>
                      <Typography 
                        variant="subtitle1"
                        sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}>
                        ${item.product.price}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'row' : 'row',
                    alignItems: 'center', 
                    gap: isMobile ? '4vw' : '0.5vw',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'space-between' : 'flex-end'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: isMobile ? '4vw' : '0.5vw' 
                    }}>
                      <IconButton 
                        onClick={() => handleQuantityChange(order.sellerId, item.product.id, item.quantity, -1)}
                        size={isMobile ? "large" : "small"}
                        sx={{ 
                          transform: isMobile ? 'scale(1.5)' : 'none'
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton 
                        onClick={() => handleQuantityChange(order.sellerId, item.product.id, item.quantity, 1)}
                        size={isMobile ? "large" : "small"}
                        sx={{ 
                          transform: isMobile ? 'scale(1.5)' : 'none'
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography sx={{ 
                      minWidth: isMobile ? 'auto' : '100px', 
                      textAlign: 'right',
                      fontSize: isMobile ? '4vw' : 'inherit'
                    }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>

                    <IconButton 
                      onClick={() => removeItem(order.sellerId, item.product.id)}
                      color="error"
                      size={isMobile ? "large" : "medium"}
                      sx={{ 
                        transform: isMobile ? 'scale(1.5)' : 'none'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ 
                margin: isMobile ? '4vw 0' : '1vw 0', 
                borderColor: 'primary.contrastText', 
                border: '1px solid' 
              }} />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '4vw' : 0
              }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}
                >
                  Order Total: ${order.total.toFixed(2)}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => handleCheckout(order)}
                  disabled={loading}
                  sx={{ 
                    backgroundColor: 'primary.contrastText', 
                    color: 'primary.main',
                    width: isMobile ? '100%' : '10vw',
                    fontSize: isMobile ? '4vw' : 'inherit',
                    padding: isMobile ? '2vw' : '0.5vw',
                    '&:hover': {
                      backgroundColor: 'primary.contrastText',
                      opacity: 0.9
                    }
                  }}
                >
                  {loading ? <CircularProgress size={isMobile ? 32 : 24} /> : 'Checkout'}
                </Button>
              </Box>
            </NormalBox>
          ))
        )}

        {orders.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            marginTop: isMobile ? '4vw' : '2vw',
            gap: isMobile ? '4vw' : 0
          }}>
            <Typography 
              variant="h5"
              sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}
            >
              Total: ${getTotalAmount().toFixed(2)}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleCheckout()}
              disabled={loading}
              sx={{ 
                backgroundColor: 'primary.contrastText', 
                color: 'primary.main',
                width: isMobile ? '100%' : '10vw',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : '0.5vw',
                '&:hover': {
                  backgroundColor: 'primary.contrastText',
                  opacity: 0.9
                }
              }}
            >
              {loading ? <CircularProgress size={isMobile ? 32 : 24} /> : 'Checkout All'}
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%', 
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            border: '1px solid #0d3e45',
            fontSize: isMobile ? '4vw' : 'inherit'
          }}
          icon={snackbarSeverity === 'success' ? <CheckCircleIcon/> : <WarningIcon sx={{ color: 'primary.contrastText' }} />}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </NBoxWithHeaderAndFooter>
  )
}

export default CartDetail