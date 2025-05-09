import React, { useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const UploadableImageGallery: React.FC = () => {
  const [images, setImages] = useState<ReactImageGalleryItem[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map(file  => ({
        original: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        originalWidth: 500,
        originalHeight: 500
      }));
      if (images.length + newImages.length <= 10) {
        setImages(prevImages => [...prevImages, ...newImages]);
      } else {
        setSnackbarOpen(true);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const newImages = Array.from(files).map(file => ({
      original: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      originalWidth: 500,
      originalHeight: 500
    }));
    if (images.length + newImages.length <= 10) {
      setImages(prevImages => [...prevImages, ...newImages]);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  return (
    <Box onDrop={handleDrop} onDragOver={handleDragOver} sx={{ position: 'relative', height: '600px', border: images.length === 0 ? '2px dashed #213547' : '2px solid #213547', borderRadius: images.length === 0 ? '0px' : '10px', display: 'flex', alignItems: 'center', justfyContent: 'center', padding: '1vw' }}>
      {images.length === 0 ? (
        <Box sx={{ textAlign: 'center', width: '50vw' }}>
          <Typography variant="h6" color="textSecondary">No images</Typography>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="upload-button" />
          <label htmlFor="upload-button">
            <Typography variant="body1" color="primary" sx={{ cursor: 'pointer' }}>Click to upload</Typography>
          </label>
        </Box>
      ) : (
        <ImageGallery items={images} showThumbnails={true} showFullscreenButton={false} showPlayButton={false} thumbnailPosition="left" showNav={false} slideDuration={500} />
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