import React from 'react';
import { Typography, Box, useMediaQuery } from '@mui/material';
import NormalBox from '../../reusable/NormalBox';
import { IProductCharacteristic } from '../../../interfaces/IProducts';
import { theme } from '../../../config/ThemeConfig';

const ProductDimensions: React.FC<IProductCharacteristic> = ({ weight, width, length, height, material, category }) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const characteristics = [
        { label: "Length", value: length },
        { label: "Width", value: width },
        { label: "Height", value: height },
        { label: "Weight", value: weight },
        { label: 'Category', value: category },
        { label: "Material", value: material?.join(", ") }
    ].filter(item => item.value !== undefined && item.value !== null);

    return (
        <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw', height: '100%'}}>
            <Typography sx={{textAlign: 'left', fontSize: isMobile ? '4vw' : 'inherit'}} variant="h6">Product Details:</Typography>
            {characteristics.length > 0 ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
                        gap: isMobile ? '2vw' : 2,
                        textAlign: 'left'
                    }}
                >
                    {characteristics.map(({ label, value }) => (
                        <Box key={label}>
                            <Typography sx={{fontSize: isMobile ? '3.5vw' : 'inherit'}} variant="body1">
                                <strong>{label}:</strong> {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography sx={{fontSize: isMobile ? '3.5vw' : 'inherit'}} variant="body1">
                    <strong>Category:</strong> {category}
                </Typography>
            )}
        </NormalBox>
    );
};

export default ProductDimensions;