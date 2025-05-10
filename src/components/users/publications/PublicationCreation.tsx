import { Autocomplete, Box, Button, Divider, TextField, Typography, Snackbar, Alert } from '@mui/material'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import NormalBox from '../../reusable/NormalBox'
import { useEffect, useState } from 'react'
import UploadableImageGallery from '../../reusable/UploadableImageGallery'
import { IProduct } from '../../../interfaces/IProducts'
import axios, { AxiosResponse } from 'axios'
import { variables } from '../../../config/variables'
import ICategory from '../../../interfaces/ICategories'
import IPaginationResponse from '../../../interfaces/IPaginationResponse'
import WarningIcon from '@mui/icons-material/Warning';

const PublicationCreation = () => {
const [images, setImages] = useState<File[]>([])
const [categories, setCategories] = useState<ICategory[]>([])
const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' })

// Form state
const [title, setTitle] = useState('')
const [price, setPrice] = useState('')
const [stock, setStock] = useState('')
const [length, setLength] = useState('')
const [width, setWidth] = useState('')
const [height, setHeight] = useState('')
const [weight, setWeight] = useState('')
const [description, setDescription] = useState('')

// Validation functions
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

const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
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
        const categories: AxiosResponse<IPaginationResponse<ICategory[]>> = await axios.get(`${variables.backendIp}/categories/get/all`)
        setCategories(categories.data.data)
    }
    categories()
}, [])

console.log(selectedCategory)

const product: IProduct = {
    id: '',
    name: '',
    description: '',
    thumbnailUrl: '',
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

  return (
    <NBoxWithHeaderAndFooter >
      <NormalBox sx={{ padding: '1vw', marginTop: '1vw', marginBottom: '1vw', display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left' }}>
            <Typography variant='h4'>Publication Creation</Typography>
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
                            onChange={(e) => {
                                setTitle(e.target.value)
                                validateTitle(e.target.value)
                            }}
                            error={title.length > 35}
                        />
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    <Typography>
                        Ensure the title does not exceed 35 characters to keep it clear and concise.
                        Use clear and precise words that accurately describe what you are selling.
                        Include relevant keywords that potential buyers might use to search for your product.
                        Keep the language simple and avoid jargon or abbreviations.
                        Place the most important words at the beginning of the title to improve visibility in search engines.
                    </Typography>
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
                        <TextField sx={{ width: '100%' }}/>
                    </Box>
                    <Typography>
                        The SKU (Stock Keeping Unit) is a unique identifier for each product.
                        It helps track inventory and ensure accurate stock levels.
                        Use a format that makes sense for your business, such as a number or a combination of letters and numbers.
                    </Typography>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                </NormalBox>
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                    <Typography variant='h5'>Category</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1vw', textAlign: 'left', padding: '0.2vw' }}>
                            <Autocomplete
                                disablePortal
                                options={categories}
                                value={selectedCategory}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => {
                                    setSelectedCategory(newValue);
                                    if (newValue) {
                                        product.categoryId = newValue.id;
                                    }
                                }}
                                sx={{ width: '100%' }}
                                renderInput={(params) => <TextField {...params}/>}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            border: '1px solid black'       
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </NormalBox>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left', width: '50%' }}>
                <UploadableImageGallery images={images} setImages={setImages} handleImageChange={handleImageChange} />
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1vw', textAlign: 'left'}}>
                    <Typography variant='h5'>Product Characteristics</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1vw', textAlign: 'left', padding: '0.2vw' }}>
                            <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', width: '50%', gap: '0.9vw'}}>
                                <Typography>Length</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={length}
                                    onChange={(e) => {
                                        setLength(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Length')
                                    }}
                                    error={length !== '' && (isNaN(Number(length)) || Number(length) < 0)}
                                />
                                <Typography>Width</Typography>
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
                                <Typography>Height</Typography>
                                <TextField 
                                    sx={{ width: '100%' }}
                                    value={height}
                                    onChange={(e) => {
                                        setHeight(e.target.value)
                                        if (e.target.value) validateNumber(e.target.value, 'Height')
                                    }}
                                    error={height !== '' && (isNaN(Number(height)) || Number(height) < 0)}
                                />
                                <Typography>Weight</Typography>
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
                            <TextField sx={{ width: '100%' }}/>
                        </Box>
                        <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                        <Box>
                        <Typography sx={{overflow: 'hidden'}}>
                            The material of the product is a key factor in its quality and durability.
                            Choose a material that is strong, durable, and comfortable to use.
                            Consider the product's intended use and the materials that are commonly used in its production.
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
                    sx={{ width: '100%' }} 
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
            <Button variant='contained' color='primary' sx={{border: '1px solid black', width: '10vw'}}>Publish</Button>
            <Button variant='contained' color='secondary' sx={{border: '1px solid black', width: '10vw'}}>Back</Button>
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

export default PublicationCreation