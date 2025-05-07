import { Box, Button, Divider, Typography } from '@mui/material'
import catlogo from '../../assets/catlogo.webp'
import SearchBar from './SearchBar'
import { JSX } from 'react';
import DropDownMenu from '../reusable/DropDownMenu';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { muiButtonNoAnimations } from '../../themes/MuiButtonNoAnimations';
import { Link } from 'react-router-dom';
import HeaderProps from '../interfaces/header/HeaderProps';
import AuthWidget from './AuthWidget';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';

const Header: React.FC<HeaderProps> = ({ sx, products, categories }): JSX.Element => {

  const categoriesNames = categories.map(category => category.name)
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw', ...sx}}>
        <Box sx={{display: 'flex', alignItems: 'end', justifyContent: 'space-between', paddingLeft: '0.5vw', paddingRight: '0.5vw'}}>
            <Link to={'/'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                <Box component='img' src={catlogo} sx={{width: '6vw'}}/>
                <Typography variant='h1' sx={{ fontSize: '0.8vw', fontWeight: 900 }}>
                    MARÍA PININA
                </Typography>
            </Link>
            <Box>
              <SearchBar products={products}/>
            </Box>
            <AuthWidget/>
        </Box>
        <Divider sx={{ border: '1px solid black' }}/>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <DropDownMenu linkTo='/categories' menuName={'Categories'} menuList={categoriesNames} queryParamName='category'/>
            <Link to={'/products'}>
              <Button
                sx={muiButtonNoAnimations}
              >
                Products
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to={'/my-orders'}>
              <Button sx={muiButtonNoAnimations}>
                My orders
              </Button>
            </Link>
            <Link to={'/cart'}>
              <IconButton aria-label="shopping-cart" sx={muiButtonNoAnimations}>
                <ShoppingCartIcon sx={{ fontSize: '1.5vw'}}/>
              </IconButton>
            </Link>
          </Box>
        </Box>
    </Box>
  )
}

export default Header