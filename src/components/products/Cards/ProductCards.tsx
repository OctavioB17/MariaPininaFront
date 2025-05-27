import React, { JSX } from 'react'
import NormalBox from '../../reusable/NormalBox'
import ProductsProps from '../../interfaces/products/ProductsProps'
import { Box, Button, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import LoadingStatic from '../../reusable/LoadingStatic';
import { Link } from 'react-router-dom';

const productCards: React.FC<ProductsProps> = ({ product, sx }): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <NormalBox sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '0.5vw', 
      borderRadius: '5px', 
      alignItems: 'center',
      width: isMobile ? '40vw' : 'auto',
      height: isMobile ? '65vw' : 'auto',
      ...sx 
    }}>
      {product.imageGallery[0] ? (
        <Box sx={{height: isMobile ? '40vw' : 'auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Box 
            component='img' 
            src={product.imageGallery[0]} 
            alt={product.name} 
            sx={{ 
              width: isMobile ? '95%' : '15vw', 
              height: isMobile ? '40vw' : '15vw', 
              border: '2px solid #0d3e45', 
              backgroundColor: 'white',
              objectFit: 'cover'
            }} 
          />
        </Box>
      ) : (
        <LoadingStatic sx={{height: isMobile ? '100vw' : '14.7vw', width: isMobile ? '95%' : '100%'}}/>
      )}      
      <Box sx={{width: '100%', height: '100%', padding: isMobile ? '1vw' : '0'}}>
        <Box sx={{height: isMobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <Typography 
            variant='subtitle1' 
            sx={{
              textAlign: 'left', 
              fontSize: isMobile ? '3.5vw' : '1.1vw', 
              width: isMobile ? '40vw' : '15vw', 
              height: isMobile ? 'auto' : '1vw', 
              fontStyle: 'italic', 
              paddingTop: isMobile ? '1vw' : '0.5vw', 
              paddingBottom: isMobile ? '1vw' : '0.5vw', 
              overflow: 'hidden',
              minHeight: isMobile ? '2rem' : 'auto'
            }}
          >
            {product.name ? product.name : <Skeleton variant="rectangular"/>}
          </Typography>
          <Typography 
            variant='body1' 
            sx={{
              textAlign: 'left', 
              fontSize: '0.9vw', 
              width:  '15vw', 
              height: '6.5vw', 
              paddingTop: '0.5vw', 
              paddingBottom: '0.5vw', 
              overflow: 'hidden',
              minHeight: 'auto',
              display: isMobile ? 'none' : '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.description ? product.description : <Skeleton variant="rectangular" width="100%" height="100%" />}
          </Typography>
          <Box sx={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: isMobile ? '40vw' : '15vw',
            marginTop: isMobile ? '1vw' : '0'
          }}>
            <Button 
              variant='outlined' 
              sx={{
                display: 'flex', 
                justifyContent: 'start', 
                width: '30vw', 
                fontSize: isMobile ? '3vw' : '1vw', 
                padding: isMobile ? '0.5vw' : '0',
                paddingTop: isMobile ? '1vw' : '0.5vw',
                paddingBottom: isMobile ? '1vw' : '0.5vw',
                minWidth: isMobile ? 'auto' : 'auto'
              }}
            >
              {product.name ? (
                <Link to={`/products/${product.id}`} style={{
                  textDecoration: 'none', 
                  color: 'inherit',
                  textAlign: 'center'
                }}>
                  Know It Better
                </Link>
              ) : (
                <Skeleton variant="rectangular" sx={{
                  width: isMobile ? '15vw' : '10vw', 
                  height: isMobile ? '1.5rem' : '2vw'
                }}/>
              )}
            </Button> 
            <Typography 
              variant='body1' 
              sx={{
                textAlign: 'center', 
                fontSize: isMobile ? '3.5vw' : '1vw',
                fontWeight: isMobile ? 'bold' : 'normal'
              }}
            >
              {product.price ? `$${product.price}` : <Skeleton variant="rectangular" sx={{
                width: isMobile ? '8vw' : '3vw', 
                height: isMobile ? '1.5rem' : '2vw'
              }}/>}
            </Typography>
          </Box>
        </Box>
      </Box>
    </NormalBox>
  )
}

export default productCards 