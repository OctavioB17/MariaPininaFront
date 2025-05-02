import React, { JSX } from 'react'
import CategoryCarrouselProps from '../interfaces/categories/CategoryCarrouselProps'
import { Box, Typography } from '@mui/material'

const CategoryCardCarrousel: React.FC<CategoryCarrouselProps> = ({ children, carrouselName }): JSX.Element => {
  return (
    <Box>
        <Typography variant='h3' sx={{ textAlign: 'left', paddingLeft: '1vw', paddingTop: '1vw' }}>
            {carrouselName}
        </Typography>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '1vw', paddingBottom: '4vw', paddingTop: '3vw'}}>
            {children}
        </Box>
    </Box>
  )
}

export default CategoryCardCarrousel