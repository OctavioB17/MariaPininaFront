import React, { JSX } from 'react'
import ProductsCarrouselProps from '../../interfaces/products/ProductsCarrouselProps'
import { Box } from '@mui/material'

const ProductsCarrousel: React.FC<ProductsCarrouselProps> = ({ children }): JSX.Element => {
  return (
    <Box sx={{display: 'flex', padding: '1vw', justifyContent: 'space-evenly'}}>
        {children}
    </Box>
  )
}

export default ProductsCarrousel