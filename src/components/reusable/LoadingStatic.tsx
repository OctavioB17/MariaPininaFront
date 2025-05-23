import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { ISxProps } from '../interfaces/SxProps';

const LoadingStatic: React.FC<ISxProps> = ({ sx }) => {

    const randomDuration = useMemo(() => {
        return Math.random() * 4 + 1; 
      }, []);

  return (
    <Box
      sx={{
        width: '15vw',
        height: '15vw',
        background: 'repeating-linear-gradient(0deg, #ccc, #ccc 1px, #333 1px, #333 2px)',
        animation: `staticNoise ${randomDuration}s infinite`,
        border: '2px solid #0d3e45',
        ...sx
      }}
    />
  );
};

export default LoadingStatic;