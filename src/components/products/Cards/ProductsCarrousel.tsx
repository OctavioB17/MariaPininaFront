import React from "react";
import Slider, { CustomArrowProps } from "react-slick";
import ProductsCarrouselProps from '../../interfaces/products/ProductsCarrouselProps'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ProductsCarrousel: React.FC<ProductsCarrouselProps> = ({ children, carrouselName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function SampleNextArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowForwardIosIcon
        className={className}
        style={{ 
          ...style, 
          display: "block", 
          color: "#0d3e45",
          fontSize: isMobile ? '1.5rem' : '2rem',
          right: isMobile ? '-5px' : '-10px',
          zIndex: 1
        }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowBackIosIcon
        className={className}
        style={{ 
          ...style, 
          display: "block", 
          color: "#0d3e45",
          fontSize: isMobile ? '1.5rem' : '2rem',
          left: isMobile ? '-5px' : '-10px',
          zIndex: 1
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: isMobile ? 2 : 5  ,
    nextArrow: <SampleNextArrow/>,
    prevArrow: <SamplePrevArrow/>,
    arrows: isMobile ? false : true,
  };

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      padding: isMobile ? '4vw 2vw' : '1vw',
      gap: isMobile ? '3vw' : '1vw'
    }}>
      <Typography 
        variant="h3" 
        sx={{
          textAlign: 'left',
          paddingLeft: isMobile ? '2vw' : '1vw',
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 'bold'
        }}
      >
        {carrouselName}
      </Typography>
      <Box sx={{ 
        alignItems: 'center',
        '& .slick-dots': {
          bottom: isMobile ? '-30px' : '-25px',
          '& li button:before': {
            fontSize: isMobile ? '8px' : '10px',
            color: '#0d3e45'
          },
          '& li.slick-active button:before': {
            color: '#0d3e45'
          }
        }
      }}>
        <Slider {...settings}>
          {React.Children.map(children, (child, index) => (
            <div key={index} style={{ padding: isMobile ? '0 5px' : '0 10px' }}>
              {child}
            </div>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductsCarrousel;