import { Autocomplete, Box, Button, Divider, TextField, Typography, Snackbar, Alert, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import NormalBox from '../../reusable/NormalBox'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { variables } from '../../../config/variables'
import { IProduct } from '../../../interfaces/IProducts'
import WarningIcon from '@mui/icons-material/Warning';
import IPaginationResponse from '../../interfaces/IPaginationResponse'
import Cookies from 'js-cookie'
import UploadableImageGallery from '../../reusable/UploadableImageGallery'
import ICategory from '../../../interfaces/ICategories'
import SuccessCheckmark from '../../reusable/SuccessCheckmark'
import { theme } from '../../../config/ThemeConfig'

const PublicationCreation = () => {
const navigate = useNavigate();
const { id: userId } = useParams();
const [images, setImages] = useState<(string | File)[]>([])
const [categories, setCategories] = useState<ICategory[]>([])
const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' })
const [isLoading, setIsLoading] = useState(false);
const [showSuccessDialog, setShowSuccessDialog] = useState(false);

const [title, setTitle] = useState('')
const [price, setPrice] = useState('')
const [stock, setStock] = useState('')
const [sku, setSku] = useState('')
const [length, setLength] = useState('')
const [width, setWidth] = useState('')
const [height, setHeight] = useState('')
const [weight, setWeight] = useState('')
const [description, setDescription] = useState('')
const [material, setMaterial] = useState('')

const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    setImages(files)
}

useEffect(() => {
    const categories = async () => {
        const response: AxiosResponse<IPaginationResponse<ICategory>> = await axios.get(`${variables.backendIp}/categories/get/all`)
        setCategories(response.data.data)
    }
    categories()
}, [])

const product: IProduct = {
    id: '',
    name: '',
    description: '',
    imageGallery: [],
    sku: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    price: 0,
    stock: 0,
    categoryId: '',
    material: [],
    isPaused: false,
    userId: '',
    createdAt: '',
    updatedAt: ''
}

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

    if (!selectedCategory) {
        setSnackbar({ open: true, message: 'Category is required', severity: 'error' })
        return false
    }

    if (images.length === 0) {
        setSnackbar({ open: true, message: 'At least one image is required', severity: 'error' })
        return false
    }

    return true
}

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateAllFields()) {
        return;
    }

    setIsLoading(true);
    try {
        const formData = new FormData();
        
        formData.append('name', title);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('sku', sku);
        formData.append('description', description);
        formData.append('categoryId', selectedCategory?.id || '');
        formData.append('isPaused', 'false');

        if (length) formData.append('length', length);
        if (width) formData.append('width', width);
        if (height) formData.append('height', height);
        if (weight) formData.append('weight', weight);

        if (material) {
            const materialsArray = material.split(',').map(m => m.trim()).filter(m => m !== '');
            formData.append('material', JSON.stringify(materialsArray));
        }

        images.forEach((image) => {
            formData.append('image', image);
        });

        const response = await axios.post(
            `${variables.backendIp}/products/create`,
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
        console.error('Error creating publication:', error);
    } finally {
        setIsLoading(false);
    }
};

const handleDialogClose = (publishAnother: boolean) => {
    setShowSuccessDialog(false);
    if (!publishAnother) {
        navigate(`/${userId}/publications`);
    }
};

  return (
    <NBoxWithHeaderAndFooter>
      <NormalBox sx={{ 
        padding: isMobile ? '4vw' : '1vw', 
        marginTop: isMobile ? '4vw' : '1vw', 
        marginBottom: isMobile ? '4vw' : '1vw', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? '4vw' : '1vw', 
        textAlign: 'left' 
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4vw' : '1vw', textAlign: 'left' }}>
            <Typography variant='h4' sx={{ fontSize: isMobile ? '6vw' : 'inherit' }}>Publication Creation</Typography>
            <Divider sx={{ border: '1px solid #0d3e45', width: '100%', marginBottom: isMobile ? '4vw' : '1vw' }} />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: isMobile ? '4vw' : '1vw', 
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
                  gap: isMobile ? '4vw' : '1.5vw', 
                  textAlign: 'left' 
                }}>
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '2vw' : '0.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Title</Typography>
                        <TextField 
                            sx={{ 
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: isMobile ? '4vw' : 'inherit',
                                padding: isMobile ? '2vw' : 'inherit'
                              }
                            }}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                validateTitle(e.target.value)
                            }}
                            error={title.length > 35}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                    <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
                        Ensure the title does not exceed 35 characters to keep it clear and concise.
                        Use clear and precise words that accurately describe what you are selling.
                        Include relevant keywords that potential buyers might use to search for your product.
                        Keep the language simple and avoid jargon or abbreviations.
                        Place the most important words at the beginning of the title to improve visibility in search engines.
                    </Typography>
                    <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                </NormalBox>
                <NormalBox sx={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: isMobile ? '4vw' : '1.5vw', 
                  textAlign: 'left' 
                }}>
                    <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Commercial Information</Typography>
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '2vw' : '0.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Price</Typography>
                        <TextField 
                            sx={{ 
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: isMobile ? '4vw' : 'inherit',
                                padding: isMobile ? '2vw' : 'inherit'
                              }
                            }}
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value)
                                validateNumber(e.target.value, 'Price')
                            }}
                            error={price !== '' && (isNaN(Number(price)) || Number(price) < 0)}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '2vw' : '0.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Stock</Typography>
                        <TextField 
                            sx={{ 
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: isMobile ? '4vw' : 'inherit',
                                padding: isMobile ? '2vw' : 'inherit'
                              }
                            }}
                            value={stock}
                            onChange={(e) => {
                                setStock(e.target.value)
                                validateNumber(e.target.value, 'Stock')
                            }}
                            error={stock !== '' && (isNaN(Number(stock)) || Number(stock) < 0)}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '2vw' : '0.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Sku</Typography>
                        <TextField 
                            sx={{ 
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: isMobile ? '4vw' : 'inherit',
                                padding: isMobile ? '2vw' : 'inherit'
                              }
                            }}
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        />
                    </Box>
                    <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
                        The SKU (Stock Keeping Unit) is a unique identifier for each product.
                        It helps track inventory and ensure accurate stock levels.
                        Use a format that makes sense for your business, such as a number or a combination of letters and numbers.
                    </Typography>
                    <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                </NormalBox>
                <NormalBox sx={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: isMobile ? '4vw' : '1.5vw', 
                  textAlign: 'left', 
                  height: '100%', 
                  justifyContent: 'center' 
                }}>
                    <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Category</Typography>
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '4vw' : '1.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Box sx={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          gap: isMobile ? '2vw' : '1vw', 
                          textAlign: 'left', 
                          padding: isMobile ? '2vw' : '0.2vw' 
                        }}>
                            <Autocomplete
                                disablePortal
                                options={categories}
                                value={selectedCategory}
                                getOptionLabel={(option) => option.name}
                                onChange={(_event, newValue) => {
                                    setSelectedCategory(newValue);
                                    if (newValue) {
                                        product.categoryId = newValue.id;
                                    }
                                }}
                                sx={{ 
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    fontSize: isMobile ? '4vw' : 'inherit',
                                    padding: isMobile ? '2vw' : 'inherit'
                                  }
                                }}
                                renderInput={(params) => <TextField {...params}/>}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            border: '1px solid #0d3e45',
                                            '& .MuiMenuItem-root': {
                                              fontSize: isMobile ? '4vw' : 'inherit',
                                              padding: isMobile ? '2vw' : 'inherit'
                                            }
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </NormalBox>
            </Box>
            <Box sx={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '4vw' : '1.5vw', 
              textAlign: 'left', 
              width: isMobile ? '100%' : '50%' 
            }}>
                <UploadableImageGallery images={images} setImages={setImages} handleImageChange={handleImageChange} />
                <NormalBox sx={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: isMobile ? '4vw' : '1vw', 
                  textAlign: 'left'
                }}>
                    <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Product Characteristics</Typography>
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: isMobile ? '4vw' : '1.5vw', 
                      textAlign: 'left' 
                    }}>
                        <Box sx={{
                          display: 'flex', 
                          flexDirection: isMobile ? 'column' : 'row', 
                          gap: isMobile ? '4vw' : '1vw', 
                          textAlign: 'left', 
                          padding: isMobile ? '2vw' : '0.2vw' 
                        }}>
                            <Box sx={{
                              display: 'flex', 
                              flexDirection: 'column', 
                              textAlign: 'left', 
                              width: isMobile ? '100%' : '50%', 
                              gap: isMobile ? '2vw' : '0.9vw'
                            }}>
                                <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Length (in cm)</Typography>
                                <TextField 
                                    sx={{ 
                                      width: '100%',
                                      '& .MuiInputBase-input': {
                                        fontSize: isMobile ? '4vw' : 'inherit',
                                        padding: isMobile ? '2vw' : 'inherit'
                                      }
                                    }}
                                    value={length}
                                    onChange={(e) => {
                                        setLength(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Length')
                                    }}
                                    error={length !== '' && (isNaN(Number(length)) || Number(length) < 0)}
                                />
                                <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Width (in cm)</Typography>
                                <TextField 
                                    sx={{ 
                                      width: '100%',
                                      '& .MuiInputBase-input': {
                                        fontSize: isMobile ? '4vw' : 'inherit',
                                        padding: isMobile ? '2vw' : 'inherit'
                                      }
                                    }}
                                    value={width}
                                    onChange={(e) => {
                                        setWidth(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Width')
                                    }}
                                    error={width !== '' && (isNaN(Number(width)) || Number(width) < 0)}
                                />
                            </Box>
                            <Box sx={{
                              display: 'flex', 
                              flexDirection: 'column', 
                              textAlign: 'left', 
                              width: isMobile ? '100%' : '50%', 
                              gap: isMobile ? '2vw' : '0.9vw'
                            }}>
                                <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Height (in cm)</Typography>
                                <TextField 
                                    sx={{ 
                                      width: '100%',
                                      '& .MuiInputBase-input': {
                                        fontSize: isMobile ? '4vw' : 'inherit',
                                        padding: isMobile ? '2vw' : 'inherit'
                                      }
                                    }}
                                    value={height}
                                    onChange={(e) => {
                                        setHeight(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Height')
                                    }}
                                    error={height !== '' && (isNaN(Number(height)) || Number(height) < 0)}
                                />
                                <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Weight (in g)</Typography>
                                <TextField 
                                    sx={{ 
                                      width: '100%',
                                      '& .MuiInputBase-input': {
                                        fontSize: isMobile ? '4vw' : 'inherit',
                                        padding: isMobile ? '2vw' : 'inherit'
                                      }
                                    }}
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
                            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Material</Typography>
                            <TextField 
                                sx={{ 
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    fontSize: isMobile ? '4vw' : 'inherit',
                                    padding: isMobile ? '2vw' : 'inherit'
                                  }
                                }}
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="Example: cotton, polyester, spandex"
                            />
                        </Box>
                        <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                        <Box>
                        <Typography sx={{
                          overflow: 'hidden',
                          fontSize: isMobile ? '4vw' : 'inherit'
                        }}>
                            Please specify the main materials used in your product.
                            You can list multiple materials separated by commas (e.g., "cotton, polyester, spandex").
                        </Typography>
                        </Box>
                        <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
                    </Box>
                </NormalBox>
            </Box>
        </Box>
        <Box>
            <NormalBox sx={{
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '4vw' : '1.5vw', 
              textAlign: 'left' 
            }}>
                <Typography variant='h5' sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Product Description</Typography>
                <TextField 
                    sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-input:focus': {
                            outline: '0 !important',
                            borderRadius: 0
                        },
                        '& .MuiInputBase-input': {
                            fontSize: isMobile ? '4vw' : 'inherit',
                            padding: isMobile ? '2vw' : 'inherit'
                        },
                        border: '1px solid #0d3e45',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }} 
                    multiline 
                    rows={isMobile ? 10 : 20}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        validateDescription(e.target.value)
                    }}
                    error={description.length > 3000}
                />
                <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>
                    Provide a detailed description of the product.
                    Include information about the product's features, benefits, and any other relevant details.
                    Use clear and concise language to make the description easy to understand.
                    Avoid using jargon or technical terms that may be confusing for potential buyers.
                    Use bullet points or lists to organize the information if needed. Use SEO-friendly language. Max characters: 3000.
                </Typography>
            </NormalBox>
        </Box>
        <Divider sx={{ border: '1px solid #0d3e45', width: '100%'}} />
        <Box sx={{
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: isMobile ? '4vw' : '1vw', 
          justifyContent: 'flex-end', 
          padding: isMobile ? '4vw' : '1vw'
        }}>
            <Button 
                variant='contained' 
                color='primary' 
                sx={{
                  border: '1px solid #0d3e45', 
                  width: isMobile ? '100%' : '10vw',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                Publish
            </Button>
            <Button 
                variant='contained' 
                color='secondary' 
                sx={{
                  border: '1px solid #0d3e45', 
                  width: isMobile ? '100%' : '10vw',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }}
                onClick={() => navigate(`/${userId}/publications`)}
            >
                Back
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
          sx={{ 
            width: '100%', 
            backgroundColor: 'primary.main', 
            color: 'primary.contrastText', 
            border: '2px solid #0d3e45',
            fontSize: isMobile ? '4vw' : 'inherit'
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
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog 
        open={showSuccessDialog} 
        onClose={() => handleDialogClose(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'primary.main',
              border: '2px solid #0d3e45',
              '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                color: 'primary.contrastText',
                fontSize: isMobile ? '4vw' : 'inherit'
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: isMobile ? '90vw' : 'auto'
            }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '5vw' : 'inherit' }}>Publication created successfully!</DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          fontSize: isMobile ? '4vw' : 'inherit'
        }}>
          <SuccessCheckmark />
          <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Publish another product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleDialogClose(false)} 
            sx={{ 
              color: 'primary.contrastText',
              fontSize: isMobile ? '4vw' : 'inherit',
              padding: isMobile ? '2vw' : 'inherit'
            }}
          >
            Back to publications
          </Button>
          <Button 
            onClick={() => handleDialogClose(true)} 
            sx={{ 
              color: 'primary.contrastText',
              fontSize: isMobile ? '4vw' : 'inherit',
              padding: isMobile ? '2vw' : 'inherit'
            }}
          >
            Publish another
          </Button>
        </DialogActions>
      </Dialog>
    </NBoxWithHeaderAndFooter>
  )
}

export default PublicationCreation