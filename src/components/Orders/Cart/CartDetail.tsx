import { Box, Typography, Button, Divider, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material'
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

const CartDetail = () => {
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
      <Box sx={{ padding: '2vw', display: 'flex', flexDirection: 'column', gap: '2vw' }}>
        <Typography variant="h4" sx={{ textAlign: 'left' }}>Shopping Cart</Typography>
        
        {orders.length === 0 ? (
          <Box sx={{border: '1px dotted #0d3e45', borderRadius: '8px', padding: '20vw'}}>
            <Typography>Your cart is empty</Typography>
            <Button onClick={() => navigate('/products')} sx={{ color: 'primary.contrastText', textDecoration: 'underline', fontSize: '1.5vw' }}>Go shopping!</Button>
          </Box>
        ) : (
          orders.map((order) => (
            <NormalBox key={order.sellerId} sx={{ borderRadius: '8px', padding: '1vw' }}>
              <Typography variant="h6" sx={{ marginBottom: '1vw', textAlign: 'left' }}>
                Order from {order.sellerName}
              </Typography>
              <Divider sx={{ margin: '1vw 0', borderColor: 'primary.contrastText', border: '1px solid' }} />
              {order.items.map((item) => (
                <Box key={item.product.id} sx={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '1vw', justifyContent: 'space-between', textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
                    <Box 
                      component="img"
                      src={item.product.imageGallery[0]}
                      sx={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #0d3e45' }}
                    />
                  
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{item.product.name}</Typography>
                      <Typography>${item.product.price}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
                      <IconButton 
                        onClick={() => handleQuantityChange(order.sellerId, item.product.id, item.quantity, -1)}
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton 
                        onClick={() => handleQuantityChange(order.sellerId, item.product.id, item.quantity, 1)}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography sx={{ minWidth: '100px', textAlign: 'right' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>

                    <IconButton 
                      onClick={() => removeItem(order.sellerId, item.product.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ margin: '1vw 0', borderColor: 'primary.contrastText', border: '1px solid' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Order Total: ${order.total.toFixed(2)}</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => handleCheckout(order)}
                  disabled={loading}
                  sx={{ 
                    backgroundColor: 'primary.contrastText', 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.contrastText',
                      opacity: 0.9
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Checkout'}
                </Button>
              </Box>
            </NormalBox>
          ))
        )}

        {orders.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2vw' }}>
            <Typography variant="h5">Total: ${getTotalAmount().toFixed(2)}</Typography>
            <Button 
              variant="contained" 
              onClick={() => handleCheckout()}
              disabled={loading}
              sx={{ 
                backgroundColor: 'primary.contrastText', 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.contrastText',
                  opacity: 0.9
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Checkout All'}
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
            border: '1px solid #0d3e45'
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