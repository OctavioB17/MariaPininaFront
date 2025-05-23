import React from "react";
import Slider, { CustomArrowProps } from "react-slick";
import ProductsCarrouselProps from '../../interfaces/products/ProductsCarrouselProps'
import { Box, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ProductsCarrousel: React.FC<ProductsCarrouselProps> = ({ children, carrouselName }) => {

  function SampleNextArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowForwardIosIcon
        className={className}
        style={{ ...style, display: "block", color: "#0d3e45" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowBackIosIcon
        className={className}
        style={{ ...style, display: "block", color: "#0d3e45" }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <SampleNextArrow/>,
    prevArrow: <SamplePrevArrow/>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', padding: '1vw', gap: '1vw'}}>
      <Typography variant="h3" sx={{textAlign: 'left', paddingLeft: '1vw'}}>
        {carrouselName}
      </Typography>
      <Box sx={{ alignItems: 'center' }}>
        <Slider {...settings}>
          {React.Children.map(children, (child, index) => (
            <div key={index}>{child}</div>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductsCarrousel;