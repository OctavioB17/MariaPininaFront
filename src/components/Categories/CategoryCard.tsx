import React, { JSX } from 'react'
import CategoryCardProps from '../interfaces/categories/CategoryCardProps'
import NormalBox from '../reusable/NormalBox'
import { Box, Typography } from '@mui/material'
import LoadingStatic from '../reusable/LoadingStatic'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }): JSX.Element => {
  return (
    <NormalBox sx={{display: 'flex', flexDirection: 'column', padding: '0.5vw'}}>
        <Box>
            {
                category.imageUrl ?
                    <Box component='img' src={category.imageUrl} sx={{width: '25vw'}}/>
                :
                    <LoadingStatic sx={{width: '26vw', height: '40vh'}}/>
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
            <Box sx={{ width: '25vw', textAlign: 'left'}}>
                <Typography>
                    {
                        category.description
                    }
                </Typography>
            </Box>
        </Box>
    </NormalBox>
  )
}

export default CategoryCard