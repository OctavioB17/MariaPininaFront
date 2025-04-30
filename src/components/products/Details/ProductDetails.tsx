import React, { useEffect, useState } from 'react'
import { IProductWithUserAndCategory } from '../../interfaces/products/IProducts'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { variables } from '../../../config/variables'
import { Box, Button, Divider, Skeleton, Typography } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import ImageGalleryComponent from '../../reusable/ImageGalleryComponent'
import ProductDimensions from './ProductDimensions'
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'

const ProductDetails: React.FC = () => {
    const { ids } = useParams()
    const [products, setProducts] = useState<IProductWithUserAndCategory | null>(null)


    useEffect(() => {
        const fetchProducts = async () => {
            const productsRequest = await axios.get<IProductWithUserAndCategory>(`${variables.backendIp}/products/get/id/${ids}`)
            setProducts(productsRequest.data)
        }

        fetchProducts()
      }, [ids])

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

      console.log(products)
  return (
    <NBoxWithHeaderAndFooter>
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
                        <Link to={`/categories/${products.categories.id}`}>{products.categories.name}</Link>
                    </Box>
                :
                    <Skeleton sx={{width: "35vw", height: '2vw', marginBottom: '-10vw' }}/>
            }
            <Box sx={{display: 'flex', gap: '2vw'}}>
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
                                <Divider sx={{borderColor: 'black'}}/>
                                <Box>
                                <span style={{fontSize: '1.5vw'}}>
                                    Offered by <Link style={{textDecoration: 'underline'}} to={``}>{products.user.name} {products.user.surname}</Link>
                                </span>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                                <Button sx={{color: 'inherit', border: '2px solid black', width: '100%'}}>
                                    Buy
                                </Button>
                                <Button sx={{color: 'inherit', border: '2px solid black', width: '100%'}}>
                                    Add to cart
                                </Button>
                            </Box>
                        </NormalBox>
                    :
                        <Skeleton sx={{width: "25vw", height: '50vw', marginBottom: '-8vw'}}/>
                }
            </Box>
            <Divider sx={{border: '1px solid black'}}/>
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
    </NBoxWithHeaderAndFooter>
  )
}

export default ProductDetails