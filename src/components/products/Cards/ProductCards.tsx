import React, { JSX } from 'react'
import NormalBox from '../../reusable/NormalBox'
import ProductsCardsProps from '../../interfaces/products/ProductsCardsProps'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LoadingStatic from './LoadingStatic';

const productCards: React.FC<ProductsCardsProps> = ({ product }): JSX.Element => {
  return (
    <NormalBox sx={{ display: 'flex', flexDirection: 'column', padding: '0.5vw', borderRadius: '5px', alignItems: 'center'}}>
      {product.imageUrl ? (
        <Box component='img' src={product.imageUrl} alt={product.name} sx={{ width: '15vw', height: '15vw', border: '2px solid black' }} />
      ) : (
        <LoadingStatic />
      )}      <Box sx={{width: '100%'}}>
        <Box>
          <Typography variant='subtitle1' sx={{textAlign: 'left', fontSize: '1.1vw', width: '15vw', fontStyle: 'italic'}}>
            {product.name ? product.name : <Skeleton variant="rectangular"/>}
          </Typography>
          <Typography variant='body1' sx={{textAlign: 'left', fontSize: '0.9vw', width: '15vw', height: '6vw'}}>
              {product.description}
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '15vw' }}>
            <Button variant='outlined' sx={{display: 'flex', justifyContent: 'start', width: '30vw', fontSize: '1vw', padding: '0', paddingTop: '0.5vw', paddingBottom: '0.5vw', }}>
              Know It Better
            </Button>
            <Typography variant='body1' sx={{textAlign: 'center', fontSize: '1vw'}}>
              ${product.price}
            </Typography>
          </Box>
        </Box>
      </Box>
    </NormalBox>
  )
}

export default productCards 