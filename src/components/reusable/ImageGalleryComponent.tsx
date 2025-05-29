import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import React from 'react'
import { JSX } from "@emotion/react/jsx-runtime";
import { imageGalleryProps } from "../../interfaces/reusable/ImageGalleryProps";
import { Box, useMediaQuery } from "@mui/material";
import { theme } from "../../config/ThemeConfig";

const ImageGalleryComponent: React.FC<imageGalleryProps> = ({ imageLinks }): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const galleryImages: ReactImageGalleryItem[] = imageLinks.map((link: string) => ({
    original: link,
    thumbnail: link,
    originalWidth: isMobile ? 300 : 500,
    originalHeight: isMobile ? 300 : 500,
    thumbnailWidth: isMobile ? 60 : 100,
    thumbnailHeight: isMobile ? 60 : 100
  }))

  return (
    <Box sx={{ 
      '& .image-gallery-slide': {
        height: isMobile ? '60vw' : '29.3vw',
        backgroundColor: 'white',
        borderRadius: '10px',
        '& img': {
          width: isMobile ? '60vw !important' : '29vw !important',
          height: isMobile ? '60vw' : '29vw',
        }
      },
      '& .image-gallery-thumbnails-container': {
        width: isMobile ? '60px' : '100px'
      },
      '& .image-gallery-thumbnail': {
        width: isMobile ? '60px' : '100px',
        height: isMobile ? '60px' : '100px',
        '& img': {
          width: isMobile ? '55px' : '95px',
          height: isMobile ? '55px' : '95px',
        }
      },
      '& .image-gallery-thumbnails': {
        padding: isMobile ? '10px 0' : '20px 0'
      }
    }}>
      <ImageGallery
        items={galleryImages}
        showThumbnails={true}
        showFullscreenButton={false}
        showPlayButton={false}
        thumbnailPosition={isMobile ? "bottom" : "left"}
        showNav={false}
        slideDuration={500}
      />
    </Box>
  )
}

export default ImageGalleryComponent