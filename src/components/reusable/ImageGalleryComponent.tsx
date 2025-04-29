import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import React from 'react'
import imageGalleryProps from "../interfaces/reusable/ImageGalleryProps";
import { JSX } from "@emotion/react/jsx-runtime";

const ImageGalleryComponent: React.FC<imageGalleryProps> = ({ imageLinks }): JSX.Element => {

  const galleryImages: ReactImageGalleryItem[] = imageLinks.map(link => ({
    original: link,
    thumbnail: link,
    originalWidth: 500,
    originalHeight: 500
  }))

  return (
    <ImageGallery
     items={(galleryImages)}
     showThumbnails={true}
     showFullscreenButton={false}
     showPlayButton={false}
     thumbnailPosition="left"
     showNav={false}
     slideDuration={500}   
     />
  )
}

export default ImageGalleryComponent