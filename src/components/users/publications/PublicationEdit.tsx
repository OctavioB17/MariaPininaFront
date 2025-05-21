import { Box, Button, Divider, TextField, Typography, Snackbar, Alert } from '@mui/material'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import NormalBox from '../../reusable/NormalBox'
import { useEffect, useState } from 'react'
import UploadableImageGallery from '../../reusable/UploadableImageGallery'
import axios from 'axios'
import { variables } from '../../../config/variables'
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AxiosResponse } from 'axios'
import { IProductWithUserAndCategory } from '../../../interfaces/IProducts'

type ImageType = File | string;

const PublicationEdit = () => {
const navigate = useNavigate();
const { productId } = useParams();
const [images, setImages] = useState<ImageType[]>([])
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' })

const [title, setTitle] = useState('')
const [categoryName, setCategoryName] = useState('')
const [price, setPrice] = useState('')
const [stock, setStock] = useState('')
const [sku, setSku] = useState('')
const [length, setLength] = useState('')
const [width, setWidth] = useState('')
const [height, setHeight] = useState('')
const [weight, setWeight] = useState('')
const [description, setDescription] = useState('')
const [material, setMaterial] = useState('')

const validateTitle = (value: string) => {
    if (value.length > 35) {
        setSnackbar({ open: true, message: 'Title must not exceed 35 characters', severity: 'error' })
        return false
    }
    return true
}

const validateNumber = (value: string, fieldName: string) => {
    if (value && isNaN(Number(value))) {
        setSnackbar({ open: true, message: `${fieldName} must be a number`, severity: 'error' })
        return false
    }
    if (value && Number(value) < 0) {
        setSnackbar({ open: true, message: `${fieldName} cannot be negative`, severity: 'error' })
        return false
    }
    return true
}

const validateDescription = (value: string) => {
    if (value.length > 3000) {
        setSnackbar({ open: true, message: 'Description must not exceed 3000 characters', severity: 'error' })
        return false
    }
    return true
}

const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackbar({ ...snackbar, open: false });
}

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setImages(prevImages => [...prevImages, ...files])
}

useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response: AxiosResponse<IProductWithUserAndCategory> = await axios.get(`${variables.backendIp}/products/get/id/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            console.log(response.data);
            const product = response.data;
            
            setTitle(product.name);
            setCategoryName(product.categories.name || '');
            setPrice(product.price.toString());
            setStock(product.stock.toString());
            setSku(product.sku);
            setLength(product.length?.toString() || '');
            setWidth(product.width?.toString() || '');
            setHeight(product.height?.toString() || '');
            setWeight(product.weight?.toString() || '');
            setDescription(product.description);
            setMaterial(product.material?.join(', ') || '');
            
            if (product.imageGallery && product.imageGallery.length > 0) {
                setImages(product.imageGallery);
            }
        } catch {
            setSnackbar({ 
                open: true, 
                message: 'Error loading product data', 
                severity: 'error' 
            });
        }
    };

    fetchProduct();
}, [productId]);

const validateAllFields = () => {
    if (!title) {
        setSnackbar({ open: true, message: 'Title is required', severity: 'error' })
        return false
    }
    if (!validateTitle(title)) return false

    if (!price) {
        setSnackbar({ open: true, message: 'Price is required', severity: 'error' })
        return false
    }
    if (!validateNumber(price, 'Price')) return false

    if (!stock) {
        setSnackbar({ open: true, message: 'Stock is required', severity: 'error' })
        return false
    }
    if (!validateNumber(stock, 'Stock')) return false

    if (length && !validateNumber(length, 'Length')) return false
    if (width && !validateNumber(width, 'Width')) return false
    if (height && !validateNumber(height, 'Height')) return false
    if (weight && !validateNumber(weight, 'Weight')) return false

    if (!description) {
        setSnackbar({ open: true, message: 'Description is required', severity: 'error' })
        return false
    }
    if (!validateDescription(description)) return false

    if (images.length === 0) {
        setSnackbar({ open: true, message: 'At least one image is required', severity: 'error' })
        return false
    }

    return true
}

const handleEdit = async () => {
    if (validateAllFields()) {
        try {
            const formData = new FormData();
            
            formData.append('name', title);
            formData.append('price', Number(price).toString());
            formData.append('stock', Number(stock).toString());
            formData.append('sku', sku);
            formData.append('description', description);
            formData.append('isPaused', 'false');

            if (length) formData.append('length', Number(length).toString());
            if (width) formData.append('width', Number(width).toString());
            if (height) formData.append('height', Number(height).toString());
            if (weight) formData.append('weight', Number(weight).toString());

            if (material) {
                const materialsArray = material.split(',').map(m => m.trim()).filter(m => m !== '');
                formData.append('material', JSON.stringify(materialsArray));
            }

            const newImages = images.filter(image => image instanceof File);
            if (newImages.length > 0) {
                newImages.forEach((image) => {
                    formData.append('image', image);
                });
            }

            const response = await axios.patch(
                `${variables.backendIp}/products/update/${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                }
            );

            if (response.status === 200) {
                setSnackbar({ 
                    open: true, 
                    message: 'Product updated successfully', 
                    severity: 'success' 
                });
                navigate(-1);
            }
        } catch (error) {
            console.error('Error completo:', error);
            setSnackbar({ 
                open: true, 
                message: 'Error updating product. Please try again.', 
                severity: 'error' 
            });
        }
    }
};

const handleImageDelete = async (index: number) => {
    try {
        const image = images[index];
        console.log('Eliminando imagen:', image);
        
        if (typeof image === 'string') {
            const urlParts = image.split('/');
            const photoId = urlParts[urlParts.length - 1];
            const deleteUrl = `${variables.backendIp}/products/delete/${productId}/photo/${photoId}`;
            console.log('URL de eliminación:', deleteUrl);
            
            const response = await axios.delete(
                deleteUrl,
                {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                }
            );

            if (response.status === 200) {
                const newImages = [...images];
                newImages.splice(index, 1);
                setImages(newImages);
                setSnackbar({
                    open: true,
                    message: 'Imagen eliminada exitosamente',
                    severity: 'success'
                });
            }
        } else {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
            setSnackbar({
                open: true,
                message: 'Imagen eliminada exitosamente',
                severity: 'success'
            });
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        setSnackbar({
            open: true,
            message: 'Error al eliminar la imagen. Por favor, intente nuevamente.',
            severity: 'error'
        });
    }
};

return (
    <NBoxWithHeaderAndFooter >
      <NormalBox sx={{ padding: '1vw', marginTop: '1vw', marginBottom: '1vw', display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left' }}>
            <Typography variant='h4'>Edit Publication</Typography>
            <Divider sx={{ border: '1px solid black', width: '100%', marginBottom: '1vw' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1vw', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2vw', textAlign: 'left', width: '50%' }}>
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', textAlign: 'left' }}>
                        <Typography variant='h5'>Title</Typography>
                        <TextField 
                            sx={{ width: '100%' }}
                            value={title}
                            disabled
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                </NormalBox>
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                    <Typography variant='h5'>Commercial Information</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', textAlign: 'left' }}>
                        <Typography>Price</Typography>
                        <TextField 
                            sx={{ width: '100%' }}
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value)
                                validateNumber(e.target.value, 'Price')
                            }}
                            error={price !== '' && (isNaN(Number(price)) || Number(price) < 0)}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', textAlign: 'left' }}>
                        <Typography>Stock</Typography>
                        <TextField 
                            sx={{ width: '100%' }}
                            value={stock}
                            onChange={(e) => {
                                setStock(e.target.value)
                                validateNumber(e.target.value, 'Stock')
                            }}
                            error={stock !== '' && (isNaN(Number(stock)) || Number(stock) < 0)}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', textAlign: 'left' }}>
                        <Typography>Sku</Typography>
                        <TextField 
                            sx={{ width: '100%' }}
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    <Typography>
                        The SKU (Stock Keeping Unit) is a unique identifier for each product.
                        It helps track inventory and ensure accurate stock levels.
                        Use a format that makes sense for your business, such as a number or a combination of letters and numbers.
                    </Typography>
                </NormalBox>
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left', height: '100%', justifyContent: 'center' }}>
                    <Typography variant='h5'>Category</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1vw', textAlign: 'left', padding: '0.2vw' }}>
                            <TextField
                                sx={{ width: '100%' }}
                                value={categoryName}
                                disabled
                            />
                        </Box>
                    </Box>
                </NormalBox>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left', width: '50%' }}>
                <UploadableImageGallery 
                    images={images} 
                    setImages={setImages} 
                    handleImageChange={handleImageChange} 
                    isEditMode={true}
                    onImageDelete={handleImageDelete}
                />
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left'}}>
                    <Typography variant='h5'>Product Characteristics</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1vw', textAlign: 'left', padding: '0.2vw' }}>
                            <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', width: '50%', gap: '0.9vw'}}>
                                <Typography>Length (in cm)</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={length}
                                    onChange={(e) => {
                                        setLength(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Length')
                                    }}
                                    error={length !== '' && (isNaN(Number(length)) || Number(length) < 0)}
                                />
                                <Typography>Width (in cm)</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={width}
                                    onChange={(e) => {
                                        setWidth(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Width')
                                    }}
                                    error={width !== '' && (isNaN(Number(width)) || Number(width) < 0)}
                                />
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', width: '50%', gap: '0.9vw'}}>
                                <Typography>Height (in cm)</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={height}
                                    onChange={(e) => {
                                        setHeight(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Height')
                                    }}
                                    error={height !== '' && (isNaN(Number(height)) || Number(height) < 0)}
                                />
                                <Typography>Weight (in g)</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={weight}
                                    onChange={(e) => {
                                        setWeight(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Weight')
                                    }}
                                    error={weight !== '' && (isNaN(Number(weight)) || Number(weight) < 0)}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Typography>Material</Typography>
                            <TextField 
                                sx={{ width: '100%' }}
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="Example: cotton, polyester, spandex"
                            />
                        </Box>
                        <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                        <Box>
                        <Typography sx={{overflow: 'hidden'}}>
                            Please specify the main materials used in your product.
                            You can list multiple materials separated by commas (e.g., "cotton, polyester, spandex").
                        </Typography>
                        </Box>
                        <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    </Box>
                </NormalBox>
            </Box>
        </Box>
        <Box>
            <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                <Typography variant='h5'>Product Description</Typography>
                <TextField 
                    sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-input:focus': {
                            outline: '0 !important',
                            borderRadius: 0
                        },
                        border: '1px solid black',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }} 
                    multiline 
                    rows={20}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        validateDescription(e.target.value)
                    }}
                    error={description.length > 3000}
                />
                <Typography>
                    Provide a detailed description of the product.
                    Include information about the product's features, benefits, and any other relevant details.
                    Use clear and concise language to make the description easy to understand.
                    Avoid using jargon or technical terms that may be confusing for potential buyers.
                    Use bullet points or lists to organize the information if needed. Use SEO-friendly language. Max characters: 3000.
                </Typography>
            </NormalBox>
        </Box>
        <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1vw', justifyContent: 'flex-end', padding: '1vw'}}>
            <Button 
                variant='contained' 
                color='primary' 
                sx={{border: '1px solid black', width: '10vw'}}
                onClick={handleEdit}
            >
                Save Changes
            </Button>
            <Button 
                variant='contained' 
                color='secondary' 
                sx={{border: '1px solid black', width: '10vw'}}
                onClick={() => navigate(-1)}
            >
                Cancel
            </Button>
        </Box>
      </NormalBox>
      <Snackbar 
        open={snackbar.open} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableWindowBlurListener
      >
        <Alert
          onClose={handleCloseSnackbar}
          sx={{ width: '100%', backgroundColor: 'primary.main', color: 'primary.contrastText', border: '2px solid black' }}
          icon={<WarningIcon sx={{ color: 'primary.contrastText' }} />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NBoxWithHeaderAndFooter>
  )
}

export default PublicationEdit 