import React, { useEffect, useState } from 'react';
import NormalBox from '../../reusable/NormalBox';
import { IProductWithUserAndCategory } from '../../../interfaces/IProducts';
import { Box, Button, Checkbox, Typography, CircularProgress } from '@mui/material';
import ThemedSwitch from '../../reusable/ThemedSwitch';
import axios from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserPublicationBox: React.FC<{ product: IProductWithUserAndCategory, isChecked: boolean, onCheckboxChange: (productId: string) => void, onPauseStateChange: (productId: string, isPaused: boolean) => void }> = ({ product, isChecked, onCheckboxChange, onPauseStateChange }) => {
  const [isPaused, setIsPaused] = useState<boolean>(product.isPaused);
  const [loading, setLoading] = useState<boolean>(false);

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
    } catch (error) {
      console.error('Error al pausar la publicación:', error);
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
    <NormalBox sx={{ display: 'flex', height: '14.5vw', padding: '0.5vw', gap: '1vw', justifyContent: 'space-between' }}>
      <Box sx={{display: 'flex', gap: '0.5vw'}}>
        <Box sx={{display: 'flex', gap: '0.5vw', width: '17vw', height: '14vw'}}>
          <Box sx={{display: 'flex', paddingTop: '0.25vw', alignItems: 'center'}}>
            <Checkbox onChange={() => onCheckboxChange(product.id)} checked={isChecked} color="default" sx={{padding: 0, margin: 0}}/>
          </Box>
          <NormalBox sx={{ padding: '0' }}>
            <Box 
              component='img' 
              alt={product.name} 
              src={product.imageGallery[0]}   
              sx={{ width: '13.5vw', height: '100%', borderRadius: '10px', backgroundColor: 'white' }} 
            />
          </NormalBox>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '0.2vw' }}>
          <Typography sx={{ fontSize: '2vw' }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: '1.2vw' }}>
            ID: {product.id}
          </Typography>
          <Box sx={{ display: 'flex', gap: '0.5vw' }}>
            <Typography sx={{ fontSize: '1.2vw' }}>
              Sell price: ${product.price}
            </Typography>
            <Button onClick={() => {
              navigate(`/${product.userId}/publications/edit/${product.id}`);
            }} sx={{ color: 'inherit', padding: '1px', fontSize: '1.2vw', height: '1.8vw' }}>
              Modify
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: '1vw' }}>
            <Typography sx={{ fontSize: '1.2vw' }}>
              Stock: {product.stock} units
            </Typography>
            <Typography sx={{ fontSize: '1.2vw' }}>
              SKU: {product.sku}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <Typography sx={{ fontSize: '1.2vw' }}>
              Category: {product.categories.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', bottom: '0.4vw' }}>
            <Typography sx={{ fontSize: '1.2vw' }}>
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
      <Box sx={{display: 'flex', alignItems: 'start '}}>
        <Button sx={{color: 'inherit'}} onClick={() => {
          navigate(`/${product.userId}/publications/edit/${product.id}`);
        }}>
          Edit
        </Button>
        <Button sx={{color: 'inherit'}} onClick={deleteProduct}>
          Delete
        </Button>
      </Box>
    </NormalBox>
  );
};

export default UserPublicationBox;