import { Box, Typography, Button, Divider, IconButton } from '@mui/material'
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import NormalBox from '../reusable/NormalBox'

const CartDetail = () => {
  const { orders, removeItem, updateItemQuantity, getTotalAmount } = useCart()
  const navigate = useNavigate()
  console.log(orders)
  const handleQuantityChange = (sellerId: string, productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      updateItemQuantity(sellerId, productId, newQuantity)
    }
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
                  sx={{ 
                    backgroundColor: 'primary.contrastText', 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.contrastText',
                      opacity: 0.9
                    }
                  }}
                >
                  Checkout
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
              sx={{ 
                backgroundColor: 'primary.contrastText', 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.contrastText',
                  opacity: 0.9
                }
              }}
            >
              Checkout All
            </Button>
          </Box>
        )}
      </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default CartDetail