import React from "react";
import Slider, { CustomArrowProps } from "react-slick";
import ProductsCarrouselProps from '../../interfaces/products/ProductsCarrouselProps'
import { Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ProductsCarrousel: React.FC<ProductsCarrouselProps> = ({ children }) => {

  function SampleNextArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowForwardIosIcon
        className={className}
        style={{ ...style, display: "block", color: "#213547" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props: CustomArrowProps ) {
    const { className, style, onClick } = props;
    return (
      <ArrowBackIosIcon
        className={className}
        style={{ ...style, display: "block", color: "#213547" }}
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
    <Box sx={{ alignItems: 'center', padding: '1vw' }}>
      <Slider {...settings}>
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
      </Slider>
    </Box>
  );
};

export default ProductsCarrousel;