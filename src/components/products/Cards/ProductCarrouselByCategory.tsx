import React from 'react'
import ProductsCarrousel from './ProductsCarrousel'
import ProductsCarrouselProps from '../../interfaces/products/ProductsCarrouselProps'

const ProductCarrouselByCategory: React.FC<ProductsCarrouselProps> = ({ children, title }) => {
  return (
    <ProductsCarrousel>
        {children}
    </ProductsCarrousel>
  )
}

export default ProductCarrouselByCategory