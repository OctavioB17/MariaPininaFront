import React, { JSX } from 'react'
import CategoryCardProps from '../interfaces/categories/CategoryCardProps'
import NormalBox from '../reusable/NormalBox'
import { Box, Typography } from '@mui/material'
import LoadingStatic from '../reusable/LoadingStatic'
import { Link } from 'react-router-dom'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }): JSX.Element => {
  return (
    <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
        <NormalBox sx={{display: 'flex', flexDirection: 'column', padding: '0.5vw', color: 'primary.contrastText'}}>
            <Box>
                {
                    category.imageUrl ?
                        <Box component='img' src={category.imageUrl} sx={{width: '25vw', height: '50vh', border: '2px solid black'}}/>
                    :
                        <LoadingStatic sx={{width: '26vw', height: '50vh'}}/>
                }
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0.5vw' }}>
                <Box>
                    <Typography variant='subtitle1' sx={{ textAlign: 'left', fontSize: '1.5vw' }}>
                        {
                            category.name
                        }
                    </Typography>
                </Box>
                <Box sx={{ width: '25vw', textAlign: 'left', height: '10vh'}}>
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