import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Snackbar, Alert, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material';
import NormalBox from '../reusable/NormalBox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { variables } from '../../config/variables';
import Cookies from 'js-cookie';
import UploadableImageGallery from '../reusable/UploadableImageGallery';
import WarningIcon from '@mui/icons-material/Warning';
import SuccessCheckmark from '../reusable/SuccessCheckmark';
import { theme } from '../../config/ThemeConfig';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<(string | File)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'error' as 'error' | 'success' 
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const validateName = (value: string) => {
    if (value.length < 3) {
      return false;
    }
    if (value.length > 50) {
      return false;
    }
    return true;
  };

  const validateDescription = (value: string) => {
    if (value.length < 100) {
      return false;
    }
    if (value.length > 500) {
      return false;
    }
    return true;
  };

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(files);
  };

  const validateAllFields = () => {
    if (!name) {
      setSnackbar({ open: true, message: 'Name is required', severity: 'error' });
      return false;
    }
    if (!validateName(name)) {
      setSnackbar({ 
        open: true, 
        message: 'Name must be between 3 and 50 characters', 
        severity: 'error' 
      });
      return false;
    }

    if (!description) {
      setSnackbar({ open: true, message: 'Description is required', severity: 'error' });
      return false;
    }
    if (!validateDescription(description)) {
      setSnackbar({ 
        open: true, 
        message: 'Description must be between 100 and 500 characters', 
        severity: 'error' 
      });
      return false;
    }

    if (images.length === 0) {
      setSnackbar({ open: true, message: 'At least one image is required', severity: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      images.forEach((image) => {
        formData.append('image', image);
      });

      const response = await axios.post(
        `${variables.backendIp}/categories/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (response.status === 201) {
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbar({
        open: true,
        message: 'Error creating category',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (createAnother: boolean) => {
    setShowSuccessDialog(false);
    if (!createAnother) {
      navigate('/admin/categories');
    } else {
      setName('');
      setDescription('');
      setImages([]);
    }
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '3vw' : '1vw', textAlign: 'left' }}>
          <Typography variant='h4' sx={{ fontSize: isMobile ? '6vw' : 'inherit' }}>Create Category</Typography>
          <Divider sx={{ border: '1px solid #0d3e45', width: '100%', marginBottom: isMobile ? '3vw' : '1vw' }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: isMobile ? '3vw' : '1vw', 
          justifyContent: 'space-between' 
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '4vw' : '2vw', 
            textAlign: 'left', 
            width: isMobile ? '100%' : '50%' 
          }}>
            <NormalBox sx={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '3vw' : '1.5vw', 
              textAlign: 'left' 
            }}>
              <Box sx={{
                display: 'flex', 
                flexDirection: 'column', 
                gap: isMobile ? '1vw' : '0.5vw', 
                textAlign: 'left', 
                width: '100%' 
              }}>
                <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Name</Typography>
                <TextField 
                  sx={{ 
                    width: '100%',
                    '& .MuiInputBase-root': {
                      fontSize: isMobile ? '4vw' : 'inherit'
                    }
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={name.length > 50}
                />
              </Box>
              <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
              <Typography sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}>
                Choose a clear and descriptive name for your category.
                The name should be between 3 and 50 characters.
                Use simple and understandable terms.
              </Typography>
            </NormalBox>

            <NormalBox sx={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '3vw' : '1.5vw', 
              textAlign: 'left' 
            }}>
              <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Description</Typography>
              <TextField 
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-root': {
                    fontSize: isMobile ? '4vw' : 'inherit'
                  }
                }}
                multiline
                rows={isMobile ? 8 : 5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={description.length > 500 || description.length < 100}
              />
              <Typography sx={{ fontSize: isMobile ? '3.5vw' : 'inherit' }}>
                Provide a detailed description of the category.
                The description should be between 100 and 500 characters.
                Explain what kind of products belong to this category.
              </Typography>
            </NormalBox>
          </Box>

          <Box sx={{
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '3vw' : '1.5vw', 
            textAlign: 'left', 
            width: isMobile ? '100%' : '50%' 
          }}>
            <UploadableImageGallery 
              images={images} 
              setImages={setImages} 
              handleImageChange={handleImageChange}
              maxImages={1}
            />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', 
          flexDirection: 'row', 
          gap: isMobile ? '3vw' : '1vw', 
          justifyContent: 'flex-end', 
          padding: isMobile ? '3vw' : '1vw'
        }}>
          <Button 
            variant='contained' 
            color='primary' 
            sx={{
              border: '1px solid #0d3e45', 
              width: isMobile ? '30vw' : '10vw',
              fontSize: isMobile ? '4vw' : 'inherit'
            }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableWindowBlurListener
      >
        <Alert
          onClose={handleCloseSnackbar}
          sx={{ 
            width: '100%', 
            backgroundColor: 'primary.main', 
            color: 'primary.contrastText', 
            border: '2px solid #0d3e45',
            '& .MuiAlert-message': {
              fontSize: isMobile ? '3.5vw' : 'inherit'
            }
          }}
          icon={<WarningIcon sx={{ color: 'primary.contrastText' }} />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" size={isMobile ? '15vw' : 'inherit'} />
      </Backdrop>

      <Dialog 
        open={showSuccessDialog} 
        onClose={() => handleDialogClose(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'primary.main',
            border: '2px solid #0d3e45',
            width: isMobile ? '90vw' : 'auto',
            '& .MuiDialogTitle-root': {
              color: 'primary.contrastText',
              fontSize: isMobile ? '5vw' : 'inherit'
            },
            '& .MuiDialogContent-root': {
              color: 'primary.contrastText',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            },
            '& .MuiDialogActions-root': {
              color: 'primary.contrastText'
            },
            '& .MuiTypography-root': {
              fontSize: isMobile ? '4vw' : 'inherit'
            },
            '& .MuiButton-root': {
              fontSize: isMobile ? '3.5vw' : 'inherit'
            }
          }
        }}
      >
        <DialogTitle>Category created successfully!</DialogTitle>
        <DialogContent>
          <SuccessCheckmark />
          <Typography>Create another category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} sx={{ color: 'primary.contrastText' }}>
            Back to categories
          </Button>
          <Button onClick={() => handleDialogClose(true)} sx={{ color: 'primary.contrastText' }}>
            Create another
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateCategory;