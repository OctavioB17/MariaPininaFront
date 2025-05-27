import React, { useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Box, Typography, Snackbar, Alert, Button, IconButton } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import { ExtendedUploadableImageGalleryProps } from '../../interfaces/reusable/ImageGalleryProps';

const UploadableImageGallery: React.FC<ExtendedUploadableImageGalleryProps> = ({ 
  images, 
  setImages, 
  isEditMode = false,
  onImageDelete,
  maxImages = 10
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (images.length + newFiles.length <= maxImages) {
        setImages(prevImages => [...prevImages, ...newFiles]);
      } else {
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteImage = () => {
    if (isEditMode && onImageDelete) {
      onImageDelete(currentIndex);
    } else {
      const newImages = [...images];
      newImages.splice(currentIndex, 1);
      setImages(newImages);
      if (currentIndex >= newImages.length) {
        setCurrentIndex(Math.max(0, newImages.length - 1));
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const newFiles = Array.from(files);
    if (images.length + newFiles.length <= maxImages) {
      setImages(prevImages => [...prevImages, ...newFiles]);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const galleryItems: ReactImageGalleryItem[] = images.map(item => {
    const isFile = item instanceof File;
    const imageUrl = isFile ? URL.createObjectURL(item) : `${item}?t=${Date.now()}`;
    
    return {
      original: imageUrl,
      thumbnail: imageUrl,
      renderItem: (item) => (
        <div style={{ 
          width: '41vw', 
          height: '31vw', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <img 
            src={item.original} 
            alt={item.originalAlt || ''} 
            style={{ 
              width: '36vw', 
              height: '29vw', 
              objectFit: 'cover' 
            }}
            key={item.original}
          />
        </div>
      )
    };
  });

  return (
    <Box 
      onDrop={handleDrop} 
      onDragOver={handleDragOver} 
      sx={{ 
        position: 'relative', 
        height: '600px', 
        border: images.length === 0 ? '2px dashed #0d3e45' : '2px solid #0d3e45', 
        borderRadius: images.length === 0 ? '0px' : '10px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1.5vw',
        cursor: images.length === 0 ? 'pointer' : 'default'
      }}
    >
      {images.length === 0 ? (
        <>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2
            }} 
            id="upload-button" 
          />
          <Box sx={{ textAlign: 'center', width: '50vw', pointerEvents: 'none' }}>
            <Typography variant="h6" color="textSecondary">No images</Typography>
            <Typography variant="body1" color="textSecondary">Click or drag to upload</Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ 
          width: 'calc(100% - 2vw)', 
          height: 'calc(100% - 2vw)', 
          position: 'relative',
          '& .image-gallery': {
            height: '100%',
            width: '100%'
          },
          '& .image-gallery-content': {
            width: '100%'
          },
          '& .image-gallery-slide-wrapper': {
            height: 'calc(100% - 100px)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          '& .image-gallery-slides': {
            height: 'calc(100% - 100px)',
            width: '100%'
          },
          '& .image-gallery-slide': {
            height: 'calc(100% - 100px)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          '& .image-gallery-thumbnail': {
            height: '5.5vw',
            width: '5.5vw',
            border: '2px solid #0d3e45',
          },
          '& .image-gallery-thumbnail .image-gallery-thumbnail-image': {
            height: '5vw',
            width: '5vw',
            objectFit: 'cover'
          }
        }}>
          <Box sx={{ display: 'flex', gap: '1vw', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <IconButton
                onClick={handleDeleteImage}
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 25,
                  backgroundColor: '#0d3e45',
                  color: 'white',
                  zIndex: 1000,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                  }
                }}
              >
                <CloseIcon sx={{ fill: 'white' }} />
              </IconButton>
              <ImageGallery 
                items={galleryItems} 
                showThumbnails={true} 
                showFullscreenButton={false} 
                showPlayButton={false} 
                thumbnailPosition="bottom" 
                showNav={false} 
                slideDuration={500}
                onSlide={setCurrentIndex}
                startIndex={currentIndex}
              />
            </Box>
            {images.length < maxImages && (
              <Box sx={{ position: 'relative', width: '100%' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ 
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }} 
                  id="upload-button" 
                />
                <Button variant="contained" sx={{ width: '100%', backgroundColor: '#0d3e45', color: 'white' }}>
                  Add photo
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          sx={{ width: '100%', backgroundColor: 'primary.main', color: 'primary.contrastText', border: '2px solid #0d3e45' }}
          icon={<WarningIcon sx={{ color: 'primary.contrastText' }} />}
        >
          {maxImages === 1 ? 'Only one image is allowed' : `You can only upload up to ${maxImages} images.`}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadableImageGallery; 