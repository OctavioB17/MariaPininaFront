import React, { JSX, useState } from 'react'
import CategoryCardProps from '../interfaces/categories/CategoryCardProps'
import NormalBox from '../reusable/NormalBox'
import { Box, Typography } from '@mui/material'
import LoadingStatic from '../reusable/LoadingStatic'
import { Link } from 'react-router-dom'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <Link to={`/products/category/${category.id}`} style={{ textDecoration: 'none' }}>
        <NormalBox sx={{display: 'flex', flexDirection: 'column', padding: '0.5vw', color: 'primary.contrastText'}}>
            <Box>
                {
                    category.imageUrl && isLoading ?
                        <Box component='img' alt={category.name} src={category.imageUrl} sx={{width: '25vw', height: '50vh', border: '2px solid black'}} onLoad={() => setIsLoading(true)} onError={() => setIsLoading(false)}/>
                    :
                        <LoadingStatic sx={{width: '26vw', height: '50vh'}}/>
                }
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0.5vw' }}>
                <Box>
                    <Typography variant='subtitle1' sx={{ textAlign: 'left', fontSize: '1.5vw', overflow: 'hidden' }}>
                        {
                            category.name
                        }
                    </Typography>
                </Box>
                <Box sx={{ width: '25vw', textAlign: 'left', height: '12vh', overflow: 'hidden'}}>
                    <Typography>
                        {
                            category.description
                        }
                    </Typography>
                </Box>
            </Box>
        </NormalBox>
    </Link>
  )
}

export default CategoryCard