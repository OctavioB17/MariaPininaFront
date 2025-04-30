import React from 'react';
import { Typography, Box } from '@mui/material';
import NormalBox from '../../reusable/NormalBox';
import { IProductCharacteristic } from '../../interfaces/products/IProducts';

const ProductDimensions: React.FC<IProductCharacteristic> = ({ weight, width, length, height, material, category }) => {

    const characteristics = [
        { label: "Length", value: length },
        { label: "Width", value: width },
        { label: "Height", value: height },
        { label: "Weight", value: weight },
        { label: 'Category', value: category },
        { label: "Material", value: material?.join(", ") }
    ].filter(item => item.value !== undefined && item.value !== null);

    return (
        <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1vw', height: '100%'}}>
            <Typography sx={{textAlign: 'left'}} variant="h6">Product Details:</Typography>
            {characteristics.length > 0 ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        textAlign: 'left'
                    }}
                >
                    {characteristics.map(({ label, value }) => (
                        <Box key={label}>
                            <Typography variant="body1">
                                <strong>{label}:</strong> {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1"><strong>Category:</strong> {category}</Typography>
            )}
        </NormalBox>
    );
};

export default ProductDimensions;