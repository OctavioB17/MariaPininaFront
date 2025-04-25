import React, { JSX } from 'react'
import NormalBox from '../reusable/NormalBox'
import ProductsCardsProps from '../interfaces/products/ProductsCardsProps'
import { Box } from '@mui/material'

const productCards: React.FC<ProductsCardsProps> = ({ id, productName, description, price, productImg }): JSX.Element => {
  return (
    <NormalBox sx={{ display: 'flex', flexDirection: 'column'}}>
      <Box component='img' src={productImg} alt={productName} sx={{  }}/>
      <Box>
        
      </Box>
    </NormalBox>
  )
}

export default productCards 