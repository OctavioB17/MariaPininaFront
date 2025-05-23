import React, { useEffect, useState } from 'react'
import { IProductWithUserAndCategory } from '../../../interfaces/IProducts'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { variables } from '../../../config/variables'
import { Box, Button, Divider, Skeleton, Typography, Snackbar, Alert } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import ImageGalleryComponent from '../../reusable/ImageGalleryComponent'
import ProductDimensions from './ProductDimensions'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { useCart } from '../../../hooks/useCart'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

const ProductDetails: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [products, setProducts] = useState<IProductWithUserAndCategory | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'warning'>('success')
    const { addItem } = useCart()
    const userId = useSelector((state: RootState) => state.user.user?.id)

    useEffect(() => {
        const fetchProducts = async () => {
            const productsRequest = await axios.get<IProductWithUserAndCategory>(`${variables.backendIp}/products/get/id/${id}`)
            setProducts(productsRequest.data)
        }

        fetchProducts()
    }, [id])

    const handleAddToCart = () => {
        if (!userId) {
            setSnackbarMessage('You need to log in before adding items to cart')
            setSnackbarSeverity('warning')
            setSnackbarOpen(true)
            return
        }

        if (products) {
            addItem(products)
            setSnackbarMessage('Product successfully added to cart')
            setSnackbarSeverity('success')
            setSnackbarOpen(true)
        }
    }

    const handleBuy = () => {
        if (!userId) {
            setSnackbarMessage('You need to log in before making a purchase')
            setSnackbarSeverity('warning')
            setSnackbarOpen(true)
            return
        }

        if (products) {
            addItem(products)
            navigate('/cart')
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false)
    }

    const StockImportance = () => {
        if (products) {
            if (products.stock > 10) {
                return (
                    <Typography sx={{fontSize: '1.1vw'}}>{products.stock} Left in Stock</Typography>
                )
            } else {
                return (
                    <Typography sx={{fontSize: '1.1vw'}}>Hurry up! only {products.stock} left in stock</Typography>
                )
            }
        }
    }

    return (
        <NBoxWithHeaderAndFooter sx={{ width: '82vw' }}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '2vw', paddingTop: '2vw', paddingBottom: '2vw'}}>
                {
                    products?.categoryId ? 
                        <Box sx={{display: 'flex', gap: '5px', padding: '0.5vw'}}>
                            <Link to={`/`}>
                                <Typography>{`Home`}</Typography>
                            </Link>
                            <Typography>{` > `}</Typography>
                            <Link to={`/categories`}>
                                <Typography>{`Categories`}</Typography>
                            </Link>
                            <Typography>{` > `}</Typography>
                            <Link style={{color: '#0d3e45'}} to={`/products/category/${products.categories.id}`}>{products.categories.name}</Link>
                        </Box>
                    :
                        <Skeleton sx={{width: "35vw", height: '2vw', marginBottom: '-10vw' }}/>
                }
                <Box sx={{display: 'flex', gap: '2vw', justifyContent: 'space-between'}}>
                    {
                        products?.imageGallery ?
                            <ImageGalleryComponent imageLinks={products.imageGallery}/>
                        :
                            <Skeleton sx={{width: "55vw", height: '50vw', marginBottom: '-8vw'}}/>
                    }
                    {
                        products ?
                            <NormalBox sx={{textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography sx={{ fontSize: '2.5vw', width: '35vw'}}>
                                        {products.name}
                                    </Typography>
                                    <Typography sx={{fontSize: '2.5vw', textDecoration: 'underline'}}>
                                        ${products.price}
                                    </Typography>
                                    <span>
                                        <StockImportance/>
                                    </span>
                                    <Divider sx={{borderColor: '#0d3e45'}}/>
                                    <Box>
                                    <span style={{fontSize: '1.5vw'}}>
                                        Offered by <Link style={{textDecoration: 'underline', color: 'inherit'}} to={`/products/user/${products.user.id}`}>{products.user.name} {products.user.surname}</Link>
                                    </span>
                                    </Box>
                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                                    <Button 
                                        onClick={handleBuy}
                                        sx={{color: 'inherit', border: '2px solid #0d3e45', width: '100%'}}>
                                        Buy
                                    </Button>
                                    <Button 
                                        onClick={handleAddToCart}
                                            sx={{width: '100%', backgroundColor: 'primary.contrastText', color: 'primary.main', border: '2px solid #0d3e45'}}>
                                        Add to cart
                                    </Button>
                                </Box>
                            </NormalBox>
                        :
                            <Skeleton sx={{width: "25vw", height: '50vw', marginBottom: '-8vw'}}/>
                    }
                </Box>
                <Divider sx={{border: '1px solid #0d3e45'}}/>
                <Box sx={{display: 'flex', gap: '1vw', position: 'relative', justifyContent: 'space-between'}}>
                    {
                        products?.description ?
                            <Typography sx={{width: '55vw', whiteSpace: 'pre-line', textAlign: 'left'}}>
                            {products.description}
                            </Typography>
                        :
                        <Skeleton sx={{width: "55vw", height: '30vw', marginBottom: '-5vw', marginTop: '-5vw'}}/>

                    }
                    {
                        products ?
                            <ProductDimensions length={products.length} width={products.width} height={products.height} weight={products.weight} material={products.material} category={products.categories.name}/>
                        :
                            <Skeleton sx={{width: "20vw", height: '30vw', marginBottom: '-5vw', marginTop: '-5vw'}}/>
                    }
                </Box>
            </Box>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity} 
                    sx={{ 
                        width: '100%', 
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText', 
                        border: '2px solid #0d3e45' 
                    }}
                    icon={snackbarSeverity === 'success' ? <CheckCircleIcon/> : <WarningIcon sx={{ color: 'primary.contrastText' }} />}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </NBoxWithHeaderAndFooter>
    )
}

export default ProductDetails