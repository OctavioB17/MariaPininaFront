import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import React from 'react'
import { JSX } from "@emotion/react/jsx-runtime";
import { imageGalleryProps } from "../../interfaces/reusable/ImageGalleryProps";
import { Box } from "@mui/material";

const ImageGalleryComponent: React.FC<imageGalleryProps> = ({ imageLinks }): JSX.Element => {
  const galleryImages: ReactImageGalleryItem[] = imageLinks.map((link: string) => ({
    original: link,
    thumbnail: link,
    originalWidth: 500,
    originalHeight: 500,
    thumbnailWidth: 100,
    thumbnailHeight: 100
  }))

  return (
    <Box sx={{ 
      '& .image-gallery-slide': {
        height: '29.3vw',
        backgroundColor: 'white',
        borderRadius: '10px',
        '& img': {
          width: '29vw !important',
          height: '29vw',
        }
      },
      '& .image-gallery-thumbnails-container': {
        width: '100px'
      },
      '& .image-gallery-thumbnail': {
        width: '100px',
        height: '100px',
        '& img': {
          width: '95px',
          height: '95px',
        }
      }
    }}>
      <ImageGallery
        items={galleryImages}
        showThumbnails={true}
        showFullscreenButton={false}
        showPlayButton={false}
        thumbnailPosition="left"
        showNav={false}
        slideDuration={500}
      />
    </Box>
  )
}

export default ImageGalleryComponent