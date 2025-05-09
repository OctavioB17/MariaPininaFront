import React, { useEffect, useState } from 'react';
import NormalBox from '../../reusable/NormalBox';
import { IProduct } from '../../../interfaces/IProducts';
import { Box, Button, Checkbox, Typography, CircularProgress } from '@mui/material';
import ThemedSwitch from '../../reusable/ThemedSwitch';
import axios from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';

const UserPublicationBox: React.FC<{ product: IProduct, isChecked: boolean, onCheckboxChange: (productId: string) => void, onPauseStateChange: (productId: string, isPaused: boolean) => void }> = ({ product, isChecked, onCheckboxChange, onPauseStateChange }) => {
  const [isPaused, setIsPaused] = useState<boolean>(product.isPaused);
  const [loading, setLoading] = useState<boolean>(false);

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
    } catch (error) {
      console.error('Error al pausar la publicación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NormalBox sx={{ display: 'flex', height: '25vh', padding: '0.5vw', gap: '1vw', justifyContent: 'space-between' }}>
      <Box sx={{display: 'flex', gap: '0.5vw'}}>
        <Box sx={{display: 'flex', gap: '0.5vw'}}>
          <Box sx={{display: 'flex', paddingTop: '0.25vw', alignItems: 'center'}}>
            <Checkbox onChange={() => onCheckboxChange(product.id)} checked={isChecked} color="default" sx={{padding: 0, margin: 0}}/>
          </Box>
          <NormalBox sx={{ padding: '0' }}>
            <Box component='img' alt={product.name} src={product.thumbnailUrl} sx={{ width: '100%', height: '100%', borderRadius: '10px' }} />
          </NormalBox>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '0.2vw' }}>
          <Typography sx={{ fontSize: '2vw' }}>
            {product.name}
          </Typography>
          <Typography>
            ID: {product.id}
          </Typography>
          <Box sx={{ display: 'flex', gap: '0.5vw' }}>
            <Typography>
              Sell price: ${product.price}
            </Typography>
            <Button sx={{ color: 'inherit', padding: '1px' }}>
              Modify
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: '1vw' }}>
            <Typography>
              Stock: {product.stock} units
            </Typography>
            <Typography>
              SKU: {product.sku}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <Typography>
              Paused: {isPaused ? 'Yes' : 'No'}
            </Typography>
            <ThemedSwitch checked={!isPaused} onClick={() => pausePublication()} />
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
      <Box sx={{display: 'flex', alignItems: 'start'}}>
        <Button sx={{color: 'inherit'}}>
          Edit
        </Button>
        <Button sx={{color: 'inherit'}}>
          Delete
        </Button>
      </Box>
    </NormalBox>
  );
};

export default UserPublicationBox;