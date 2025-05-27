import React, { JSX } from 'react'
import CategoryCarrouselProps from '../interfaces/categories/CategoryCarrouselProps'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'

const CategoryCardCarrousel: React.FC<CategoryCarrouselProps> = ({ children, carrouselName }): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
        <Typography 
          variant='h3' 
          sx={{ 
            textAlign: 'left', 
            paddingLeft: isMobile ? '4vw' : '1vw', 
            paddingTop: isMobile ? '4vw' : '1vw',
            fontSize: isMobile ? '5vw' : '3vw'
          }}
        >
            {carrouselName}
        </Typography>
        <Box sx={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isMobile ? 'center' : 'space-evenly', 
          padding: isMobile ? '4vw' : '1vw', 
          paddingBottom: isMobile ? '8vw' : '4vw', 
          paddingTop: isMobile ? '4vw' : '3vw',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4vw' : '0'
        }}>
            {children}
        </Box>
    </Box>
  )
}

export default CategoryCardCarrousel