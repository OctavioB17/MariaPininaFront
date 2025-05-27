export interface ExtendedUploadableImageGalleryProps {
    images: (File | string)[];
    setImages: React.Dispatch<React.SetStateAction<(File | string)[]>>;
    handleImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isEditMode?: boolean;
    onImageDelete?: (index: number) => void;
    maxImages?: number;
}

export interface imageGalleryProps {
    imageLinks: string[];
} 