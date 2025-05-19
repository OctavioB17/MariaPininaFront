import React, { useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface UploadableImageGalleryProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadableImageGallery: React.FC<UploadableImageGalleryProps> = ({ images, setImages }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (images.length + newFiles.length <= 10) {
        setImages(prevImages => [...prevImages, ...newFiles]);
      } else {
        setSnackbarOpen(true);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const newFiles = Array.from(files);
    if (images.length + newFiles.length <= 10) {
      setImages(prevImages => [...prevImages, ...newFiles]);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const galleryItems: ReactImageGalleryItem[] = images.map(file => ({
    original: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file),
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
            width: '40vw', 
            height: '30vw', 
            objectFit: 'cover' 
          }} 
        />
      </div>
    )
  }));

  return (
    <Box 
      onDrop={handleDrop} 
      onDragOver={handleDragOver} 
      sx={{ 
        position: 'relative', 
        height: '600px', 
        border: images.length === 0 ? '2px dashed #213547' : '2px solid #213547', 
        borderRadius: images.length === 0 ? '0px' : '10px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1vw',
        cursor: 'pointer'
      }}
    >
      <input 
        type="file" 
        multiple 
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
      {images.length === 0 ? (
        <Box sx={{ textAlign: 'center', width: '50vw', pointerEvents: 'none' }}>
          <Typography variant="h6" color="textSecondary">No images</Typography>
          <Typography variant="body1" color="primary">Click or drag to upload</Typography>
        </Box>
      ) : (
        <Box sx={{ 
          width: 'calc(100% - 2vw)', 
          height: 'calc(100% - 2vw)', 
          pointerEvents: 'none',
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
            border: '2px solid black',
          },
          '& .image-gallery-thumbnail .image-gallery-thumbnail-image': {
            height: '5vw',
            width: '5vw',
            objectFit: 'cover'
          }
        }}>
          <ImageGallery 
            items={galleryItems} 
            showThumbnails={true} 
            showFullscreenButton={false} 
            showPlayButton={false} 
            thumbnailPosition="bottom" 
            showNav={false} 
            slideDuration={500}
          />
        </Box>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          sx={{ width: '100%', backgroundColor: 'primary.main', color: 'primary.contrastText', border: '2px solid black' }}
          icon={<WarningIcon sx={{ color: 'primary.contrastText' }} />}
        >
          You can only upload up to 10 images.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadableImageGallery; 