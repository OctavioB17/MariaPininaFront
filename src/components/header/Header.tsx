import { Box, Button, Divider, Typography, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemText, Collapse, ListItemButton, Avatar } from '@mui/material'
import catlogo from '../../assets/catlogo.webp'
import SearchBar from './SearchBar'
import { JSX, useState } from 'react';
import DropDownMenu from '../reusable/DropDownMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import { Link } from 'react-router-dom';
import HeaderProps from '../interfaces/header/HeaderProps';
import AuthWidget from './AuthWidget';
import useIsLogged from '../../hooks/useIsLogged';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectUser } from '../../store/userSlice';
import { muiButtonNoAnimations } from '../../themes/MuiButtonNoAnimations';
import { useUserLogout } from '../../hooks/useUserLogout';

const Header: React.FC<HeaderProps> = ({ sx, products, categories }): JSX.Element => {
  const isLogged = useIsLogged()
  const user = useAppSelector(selectUser)
  const userId = isLogged ? user?.id : null
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const logout = useUserLogout();
  const name = sessionStorage.getItem('name');
  const surname = sessionStorage.getItem('surname');

  const categoriesNamesAndIds = categories.map(category => ({ 
    name: category.name, 
    productIdUrl: `/products/category/${category.id}` 
  }));

  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (name: string, surname: string) => {
    return {
      sx: {
        bgcolor: stringToColor(name + surname),
        color: '#fff'
      },
      children: `${name[0]}${surname[0]}`.toUpperCase()
    };
  };

  const CatAvatar = () => {
    const color = stringToColor(name! + surname!);
    return (
      <Box sx={{ position: 'relative', width: 56, height: 56, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Avatar {...stringAvatar(name!, surname!)} />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 9,
            width: 14,
            height: 14,
            backgroundColor: color,
            transform: 'rotate(-20deg)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 9,
            width: 14,
            height: 14,
            backgroundColor: color,
            transform: 'rotate(20deg)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            zIndex: 1,
          }}
        />
      </Box>
    );
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      slotProps={{
        paper: {
          sx: {
            width: '80%',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }
        }
      }}
    >
      <List>
        {isLogged ? (
          <>
            <ListItem sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '2rem 0'
            }}>
              <CatAvatar />
              <Typography sx={{ 
                color: 'primary.contrastText',
                fontSize: '1.2rem',
                marginTop: '1rem'
              }}>
                {`${name} ${surname}`}
              </Typography>
            </ListItem>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          </>
        ) : (
          <>
            <ListItem sx={{ justifyContent: 'center', gap: '1rem', padding: '1rem' }}>
              <Link to="/login" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'primary.contrastText',
                textDecoration: 'none'
              }}>
                <Typography variant="h6">Log-in</Typography>
                <Face5Icon />
              </Link>
              <Link to="/register" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'primary.contrastText',
                textDecoration: 'none'
              }}>
                <Typography variant="h6">Sign-in</Typography>
                <Face6Icon />
              </Link>
            </ListItem>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          </>
        )}

        <ListItemButton 
          onClick={handleCategoriesClick}
          sx={{ 
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <ListItemText 
            primary="Categories" 
            slotProps={{ 
              primary: { 
                sx: { 
                  color: 'primary.contrastText',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                } 
              } 
            }} 
          />
          {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categoriesNamesAndIds.map((category) => (
              <ListItem 
                key={category.name} 
                component={Link} 
                to={category.productIdUrl}
                onClick={handleMobileMenuToggle}
                sx={{ 
                  paddingLeft: '2rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ListItemText 
                  primary={category.name} 
                  slotProps={{ 
                    primary: { 
                      sx: { 
                        color: 'primary.contrastText',
                        fontSize: '1rem'
                      } 
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem 
          component={Link} 
          to="/products"
          onClick={handleMobileMenuToggle}
          sx={{ 
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <ListItemText 
            primary="Products" 
            slotProps={{ 
              primary: { 
                sx: { 
                  color: 'primary.contrastText',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                } 
              } 
            }} 
          />
        </ListItem>

        {isLogged && (
          <>
            <ListItem 
              component={Link} 
              to={`/${userId}/publications`}
              onClick={handleMobileMenuToggle}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Publications" 
                slotProps={{ 
                  primary: { 
                    sx: { 
                      color: 'primary.contrastText',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    } 
                  } 
                }} 
              />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/orders"
              onClick={handleMobileMenuToggle}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="My orders" 
                slotProps={{ 
                  primary: { 
                    sx: { 
                      color: 'primary.contrastText',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    } 
                  } 
                }} 
              />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/cart"
              onClick={handleMobileMenuToggle}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Cart" 
                slotProps={{ 
                  primary: { 
                    sx: { 
                      color: 'primary.contrastText',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    } 
                  } 
                }} 
              />
            </ListItem>
            {user && (user.role === 'ADMIN' || user.role === 'MODERATOR' || user.role === 'SUPER_ADMIN') && (
              <ListItem 
                component={Link} 
                to="/admin"
                onClick={handleMobileMenuToggle}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ListItemText 
                  primary="Admin menu" 
                  slotProps={{ 
                    primary: { 
                      sx: { 
                        color: 'primary.contrastText',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      } 
                    } 
                  }} 
                />
              </ListItem>
            )}
            <ListItem 
              onClick={handleLogout}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Logout" 
                slotProps={{ 
                  primary: { 
                    sx: { 
                      color: 'primary.contrastText',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    } 
                  } 
                }} 
              />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '2vw' : '1vw', 
      ...sx
    }}>
      <Box sx={{
        display: 'flex', 
        alignItems: isMobile ? 'flex-end' : 'center', 
        justifyContent: 'space-between', 
        padding: isMobile ? '2vw' : '0.5vw'
      }}>
        <Link to={'/'} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          <Box 
            component='img' 
            alt='maria-pinina-logo' 
            src={catlogo} 
            sx={{
              width: isMobile ? '15vw' : '6vw'
            }}
          />
          <Typography 
            variant='h1' 
            sx={{ 
              fontSize: isMobile ? '3vw' : '0.8vw', 
              display: isMobile ? 'none' : 'block',
              fontWeight: 900 
            }}
          >
            MARÍA PININA
          </Typography>
        </Link>
        <Box sx={{
          width: isMobile ? '60%' : 'auto'
        }}>
          <SearchBar products={products}/>
        </Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '2vw' : '1vw'
        }}>
          {isMobile ? (
            <IconButton 
              onClick={handleMobileMenuToggle}
              sx={{ color: 'primary.main' }}
            >
              <MenuIcon sx={{ fontSize: '6vw' }}/>
            </IconButton>
          ) : (
            <AuthWidget/>
          )}
        </Box>
      </Box>
      <Divider sx={{ border: '1px solid #0d3e45', display: isMobile ? 'none' : 'block' }}/>
      {!isMobile && (
        <Box sx={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Box sx={{
            display: 'flex', 
            alignItems: 'center'
          }}>
            <DropDownMenu 
              linkTo='/categories' 
              menuName={'Categories'} 
              menuList={categoriesNamesAndIds.map(category => category.name)} 
              subMenusLinks={categoriesNamesAndIds.map(category => category.productIdUrl)} 
              queryParamName='category'
            />
            <Link to={'/products'}>
              <Button sx={muiButtonNoAnimations}>
                Products
              </Button>
            </Link>
          </Box>
          {isLogged && (
            <Box>
              <Link to={`/${userId}/publications`}>
                <Button sx={muiButtonNoAnimations}>
                  Publications
                </Button>
              </Link>
              <Link to={`/orders`}>
                <Button sx={muiButtonNoAnimations}>
                  My orders
                </Button>
              </Link>
              <Link to={`/cart`}>
                <IconButton aria-label="shopping-cart" sx={muiButtonNoAnimations}>
                  <ShoppingCartIcon sx={{ fontSize: '1.5vw'}}/>
                </IconButton>
              </Link>
            </Box>
          )}
        </Box>
      )}
      {isMobile && <MobileMenu />}
    </Box>
  )
}

export default Header