import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/landing/LandingPage';
import ProductDetails from './components/products/Details/ProductDetails';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UserLogin from './components/users/auth/UserLogin';
import UserRegister from './components/users/auth/UserRegister';
import AuthInitializer from './components/users/auth/AuthInitializer';
import useIsLogged from './hooks/useIsLogged';
import useTokenRenewal from './hooks/useTokenRenewal';
import UserAccountAuthorization from './components/users/auth/UserAccountAuthorization';
import UserPasswordChange from './components/users/auth/UserPasswordChange';
import UserPasswordResetRequest from './components/users/auth/UserPasswordResetRequest';
import UserPublicationsMenu from './components/users/publications/UserPublicationsMenu';
import ProtectedRoute from './components/Routes/UserProtectedRoute';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import PublicationCreation from './components/users/publications/PublicationCreation';
import PublicationEdit from './components/users/publications/PublicationEdit';
import CartDetail from './components/Orders/Cart/CartDetail';
import ProductGridGallery from './components/products/ProductGrids/ProductGridGallery';
import AllCategoriesDisplay from './components/Categories/AllCategoriesDisplay';
import OrdersView from './components/Orders/OrdersView';
import AdminMenu from './components/users/admin/AdminMenu';
import { useAppSelector } from './hooks/useAppSelector';
import { selectUser } from './store/userSlice';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const isLogged = useIsLogged();
  const theme = useTheme();
  useTokenRenewal(isLogged);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (loading) {
      document.body.classList.add('no-padding');
    } else {
      document.body.classList.remove('no-padding');
    }
  }, [loading]);

  return (
    <>
      <AuthInitializer setLoading={setLoading} />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            border: '2px solid black',
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <CircularProgress
            sx={{
              color: theme.palette.primary.contrastText,
            }}
          />
        </Box>
      ) : (
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/categories' element={<AllCategoriesDisplay />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/products' element={<ProductGridGallery filterBy='Product'/>} />
          <Route path='/products/category/:categoryId' element={<ProductGridGallery filterBy='Category'/>} />
          <Route path='/products/search/:searchTerm' element={<ProductGridGallery filterBy='Search'/>} />
          <Route path='/products/user/:userId' element={<ProductGridGallery filterBy='User'/>} />
          {!isLogged && (
            <>
              <Route path='/login' element={<UserLogin />} />
              <Route path='/register' element={<UserRegister />} />
            </>
          )}
          {isLogged && (
            <>
              <Route path='/:id/publications' element={<ProtectedRoute />}>
                <Route path='/:id/publications' element={<UserPublicationsMenu />} />
                <Route path='/:id/publications/create' element={<PublicationCreation />} />
                <Route path='/:id/publications/edit/:productId' element={<PublicationEdit />} />
              </Route>
              <Route path='/cart' element={<CartDetail />} />
              <Route path='/orders' element={<OrdersView />} />
              {(user?.role === 'ADMIN' || user?.role === 'MODERATOR' || user?.role === 'SUPER_ADMIN') && (
                <Route path='/admin/*' element={<AdminMenu />} />
              )}
            </>
          )}
          <Route path='/authorize-user/:id' element={<UserAccountAuthorization />} />
          <Route path='/reset-password' element={<UserPasswordResetRequest />} />
          <Route path='/reset-password/reset' element={<UserPasswordChange />} />
          {/* <Route path='*' element={<Navigate to="/" />} /> */}
        </Routes>
      )}
    </>
  );
}

export default App;