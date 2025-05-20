export interface imageGalleryProps {
    imageLinks: string[]
}
export interface UploadableImageGalleryProps {
    images: File[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  

export interface ExtendedUploadableImageGalleryProps extends UploadableImageGalleryProps {
    isEditMode?: boolean;
    onImageDelete?: (index: number) => void;
  }