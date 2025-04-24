import { Box, Button, Divider, Typography } from '@mui/material'
import catlogo from '../../assets/catlogo.webp'
import SearchBar from './SearchBar'
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import SxProps from '../interfaces/SxProps';
import { JSX } from 'react';
import DropDownMenu from '../reusable/DropDownMenu';
import { filmLabels } from './top100films';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { muiButtonNoAnimations } from '../../themes/MuiButtonNoAnimations';
import { Link } from 'react-router-dom';

const Header: React.FC<SxProps> = ({ sx }): JSX.Element => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw', ...sx}}>
        <Box sx={{display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box component='img' src={catlogo} sx={{width: '6vw'}}/>
                <Typography variant='h1' sx={{ fontSize: '0.8vw', fontWeight: 900 }}>
                    MARÍA PININA
                </Typography>
            </Box>
            <Box>
              <SearchBar/>
            </Box>
            <Box sx={{display: 'flex', gap: '1vw'}}>
              <Box sx={{display: 'flex', gap: '1vw', alignItems: 'center'}}>
                <Typography variant='h4'>Log-in</Typography>
                <Face5Icon/>
              </Box>
              <Box sx={{display: 'flex', gap: '1vw', alignItems: 'center'}}>
                <Typography variant='h4'>Sign-in</Typography>
                <Face6Icon/>
              </Box>
            </Box>
        </Box>
        <Divider sx={{ border: '1px solid black' }}/>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <DropDownMenu linkTo='/categories' menuName={'Categories'} menuList={filmLabels}/>
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