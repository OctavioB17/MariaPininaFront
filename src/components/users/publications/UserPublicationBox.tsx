import React, { useEffect, useState } from 'react';
import NormalBox from '../../reusable/NormalBox';
import { IProductWithUserAndCategory } from '../../../interfaces/IProducts';
import { Box, Button, Checkbox, Typography, CircularProgress, Snackbar, useMediaQuery } from '@mui/material';
import ThemedSwitch from '../../reusable/ThemedSwitch';
import axios from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../config/ThemeConfig';

const UserPublicationBox: React.FC<{ product: IProductWithUserAndCategory, isChecked: boolean, onCheckboxChange: (productId: string) => void, onPauseStateChange: (productId: string, isPaused: boolean) => void }> = ({ product, isChecked, onCheckboxChange, onPauseStateChange }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPaused, setIsPaused] = useState<boolean>(product.isPaused);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  
  useEffect(() => {
    setIsPaused(product.isPaused);
  }, [product.isPaused]);

  const pausePublication = async () => {
    setLoading(true);
    try {
      const pause = await axios.patch(
        `${variables.backendIp}/products/update/pause`,
        { ids: [product.id] },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (pause.status === 200) {
        const newIsPaused = !isPaused;
        setIsPaused(newIsPaused);
        onPauseStateChange(product.id, newIsPaused);
      }
      return pause;
    } catch {
      setSnackbar({
        open: true,
        message: 'Error pausing publication. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    setLoading(true);
    try {
      await axios.delete(`${variables.backendIp}/products/delete`, {
        data: { ids: [product.id] },
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <NormalBox sx={{ 
      display: 'flex', 
      padding: isMobile ? '4vw' : '0.5vw', 
      gap: isMobile ? '4vw' : '1vw', 
      justifyContent: 'space-between',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <Box sx={{
        display: 'flex', 
        gap: isMobile ? '4vw' : '0.5vw',
        flexDirection: isMobile ? 'column' : 'row',
        width: isMobile ? '100%' : 'auto'
      }}>
        <Box sx={{
          display: 'flex', 
          gap: isMobile ? '4vw' : '0.5vw', 
          width: isMobile ? '100%' : '17vw',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Box sx={{
            display: 'flex', 
            paddingTop: isMobile ? '2vw' : '0.25vw', 
            alignItems: 'center'
          }}>
            <Checkbox 
              onChange={() => onCheckboxChange(product.id)} 
              checked={isChecked} 
              color="default" 
              sx={{
                padding: 0, 
                margin: 0,
                transform: isMobile ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          </Box>
          <NormalBox sx={{ 
            padding: '0', 
            width: isMobile ? '100%' : 175, 
            height: isMobile ? '60vw' : 175 
          }}>
            <Box 
              component='img' 
              alt={product.name} 
              src={product.imageGallery[0]}   
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '10px', 
                backgroundColor: 'white' 
              }} 
            />
          </NormalBox>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          textAlign: 'left', 
          gap: isMobile ? '2vw' : '0.2vw',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Typography sx={{ fontSize: isMobile ? '6vw' : '1.5vw' }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
            ID: {product.id}
          </Typography>
          <Box sx={{ display: 'flex', gap: isMobile ? '2vw' : '0.5vw', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
              Sell price: ${product.price}
            </Typography>
            <Button 
              onClick={() => {
                navigate(`/${product.userId}/publications/edit/${product.id}`);
              }} 
              sx={{ 
                color: 'inherit', 
                padding: isMobile ? '2vw' : '1px', 
                fontSize: isMobile ? '4vw' : '1.2vw', 
                height: isMobile ? 'auto' : '1.8vw' 
              }}
            >
              Modify
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: isMobile ? '2vw' : '1vw', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
              Stock: {product.stock} units
            </Typography>
            <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
              SKU: {product.sku}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? '2vw' : '1vw' }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
              Category: {product.categories.name}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            position: isMobile ? 'static' : 'relative', 
            bottom: isMobile ? 0 : '0.4vw',
            gap: isMobile ? '2vw' : '1vw'
          }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : '1vw' }}>
              Paused: {isPaused ? 'Yes' : 'No'}
            </Typography>
            <ThemedSwitch 
              checked={!isPaused} 
              onClick={() => pausePublication()} 
              sx={{
                transform: isMobile ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          </Box>
        </Box>

        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(232, 220, 199, 0.90)',
              zIndex: 1000,
            }}
          >
            <CircularProgress sx={{color: 'primary.contrastText'}}/>
          </Box>
        )}
      </Box>
      <Box sx={{
        display: 'flex', 
        alignItems: isMobile ? 'center' : 'start',
        justifyContent: isMobile ? 'center' : 'flex-end',
        gap: isMobile ? '4vw' : '1vw',
        width: isMobile ? '100%' : 'auto'
      }}>
        <Button 
          sx={{
            color: 'inherit',
            fontSize: isMobile ? '4vw' : 'inherit',
            padding: isMobile ? '2vw' : 'inherit'
          }} 
          onClick={() => {
            navigate(`/${product.userId}/publications/edit/${product.id}`);
          }}
        >
          Edit
        </Button>
        <Button 
          sx={{
            color: 'inherit',
            fontSize: isMobile ? '4vw' : 'inherit',
            padding: isMobile ? '2vw' : 'inherit'
          }} 
          onClick={deleteProduct}
        >
          Delete
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
        message={snackbar.message}
      />
    </NormalBox>
  );
};

export default UserPublicationBox;