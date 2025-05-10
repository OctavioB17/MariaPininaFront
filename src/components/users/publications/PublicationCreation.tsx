import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import NormalBox from '../../reusable/NormalBox'
import { useState } from 'react'
import UploadableImageGallery from '../../reusable/UploadableImageGallery'
import { IProduct } from '../../../interfaces/IProducts'

const PublicationCreation = () => {

const [images, setImages] = useState<File[]>([])

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setImages(files)
}

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
                        <TextField sx={{ width: '100%' }}/>
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
                        <TextField sx={{ width: '100%' }}/>
                    </Box>
                    <Divider sx={{ border: '1px solid #213547', width: '100%'}} />
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', textAlign: 'left' }}>
                        <Typography>Stock</Typography>
                        <TextField sx={{ width: '100%' }}/>
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
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                <UploadableImageGallery images={images} setImages={setImages} handleImageChange={handleImageChange} />
                <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                    <Typography variant='h5'>Product Characteristics</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1vw', textAlign: 'left', padding: '0.2vw' }}>
                        <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', width: '50%', gap: '0.9vw' }}>
                            <Typography>Length</Typography>
                            <TextField sx={{ width: '100%' }}/>
                            <Typography>Width</Typography>
                            <TextField sx={{ width: '100%' }}/>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', width: '50%', gap: '0.9vw'    }}>
                            <Typography>Height</Typography>
                            <TextField sx={{ width: '100%' }}/>
                            <Typography>Weight</Typography>
                            <TextField sx={{ width: '100%' }}/>
                        </Box>
                    </Box>
                </NormalBox>
            </Box>
        </Box>
        <Box>
            <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1.5vw', textAlign: 'left' }}>
                <Typography variant='h5'>Product Description</Typography>
                <TextField sx={{ width: '100%' }} multiline rows={20} />
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
    </NBoxWithHeaderAndFooter>
  )
}

export default PublicationCreation