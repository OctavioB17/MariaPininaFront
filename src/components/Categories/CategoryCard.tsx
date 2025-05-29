import React, { JSX, useState } from 'react'
import CategoryCardProps from '../interfaces/categories/CategoryCardProps'
import NormalBox from '../reusable/NormalBox'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import LoadingStatic from '../reusable/LoadingStatic'
import { Link } from 'react-router-dom'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Link to={`/products/category/${category.id}`} style={{ textDecoration: 'none' }}>
        <NormalBox sx={{
          display: 'flex', 
          flexDirection: 'column', 
          padding: '0.5vw', 
          color: 'primary.contrastText', 
          borderRadius: '4px', 
          paddingLeft: isMobile ? '2vw' : '0.1vw', 
          paddingRight: isMobile ? '2vw' : '0.1vw',
          paddingTop: isMobile ? '2vw' : '0.1vw',
          width: isMobile ? '80vw' : 'auto',
          height: isMobile ? '90vw' : 'auto'
        }}>
            <Box>
                {
                    category.imageUrl && isLoading ?
                        <Box 
                          component='img' 
                          alt={category.name} 
                          src={category.imageUrl} 
                          sx={{
                            width: isMobile ? '78vw' : '25vw', 
                            height: isMobile ? '50vw' : '50vh', 
                            border: '2px solid black',
                            objectFit: 'contain'
                          }} 
                          onLoad={() => setIsLoading(true)} 
                          onError={() => setIsLoading(false)}
                        />
                    :
                        <LoadingStatic sx={{
                          width: isMobile ? '78vw' : '25vw', 
                          height: isMobile ? '50vw' : '50vh'
                        }}/>
                }
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              padding: isMobile ? '2vw' : '0.5vw',
              height: '100%'
            }}>
                <Box>
                    <Typography 
                      variant='subtitle1' 
                      sx={{ 
                        textAlign: 'left', 
                        fontSize: isMobile ? '5vw' : '1.5vw', 
                        overflow: 'hidden',
                        fontWeight: 'bold'
                      }}
                    >
                        {category.name}
                    </Typography>
                </Box>
                <Box sx={{ 
                  width: isMobile ? '100%' : '25vw', 
                  textAlign: 'left', 
                  height: isMobile ? '100%' : '13vh', 
                  overflow: 'hidden',
                  marginTop: isMobile ? '1vw' : '0'
                }}>
                    <Typography sx={{
                      fontSize: isMobile ? '1rem' : 'inherit',
                      display: '-webkit-box',
                      WebkitLineClamp: isMobile ? 3 : 6,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '100%'
                    }}>
                        {category.description}
                    </Typography>
                </Box>
            </Box>
        </NormalBox>
    </Link>
  )
}

export default CategoryCard