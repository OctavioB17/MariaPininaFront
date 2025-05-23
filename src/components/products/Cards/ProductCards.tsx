import React, { JSX } from 'react'
import NormalBox from '../../reusable/NormalBox'
import ProductsProps from '../../interfaces/products/ProductsProps'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import LoadingStatic from '../../reusable/LoadingStatic';
import { Link } from 'react-router-dom';

const productCards: React.FC<ProductsProps> = ({ product, sx }): JSX.Element => {
  return (
    <NormalBox sx={{ display: 'flex', flexDirection: 'column', padding: '0.5vw', borderRadius: '5px', alignItems: 'center', ... sx }}>
      {product.imageGallery[0] ? (
        <Box component='img' src={product.imageGallery[0]} alt={product.name} sx={{ width: '15vw', height: '15vw', border: '2px solid #0d3e45', backgroundColor: 'white' }} />
      ) : (
        <LoadingStatic />
      )}      
      <Box sx={{width: '100%'}}>
        <Box>
          <Typography variant='subtitle1' sx={{textAlign: 'left', fontSize: '1.1vw', width: '15vw', height: '1vw', fontStyle: 'italic', paddingTop: '0.5vw', paddingBottom: '0.5vw', overflow: 'hidden'}}>
            {product.name ? product.name : <Skeleton variant="rectangular"/>}
          </Typography>
          <Typography variant='body1' sx={{textAlign: 'left', fontSize: '0.9vw', width: '15vw', height: '6.5vw', paddingTop: '0.5vw', paddingBottom: '0.5vw', overflow: 'hidden'}}>
                {product.description ? product.description : <Skeleton variant="rectangular" width="100%" height="100%" />}
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '15vw' }}>
            <Button variant='outlined' sx={{display: 'flex', justifyContent: 'start', width: '30vw', fontSize: '1vw', padding: '0', paddingTop: '0.5vw', paddingBottom: '0.5vw', }}>
              {product.name ?  <Link to={`/products/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>Know It Better</Link> : <Skeleton variant="rectangular" sx={{width: '10vw', height: '2vw'}}/>}
            </Button> 
            <Typography variant='body1' sx={{textAlign: 'center', fontSize: '1vw'}}>
              {product.price ? `$${product.price}` : <Skeleton variant="rectangular" sx={{width: '3vw', height: '2vw'}}/>}
            </Typography>
          </Box>
        </Box>
      </Box>
    </NormalBox>
  )
}

export default productCards 