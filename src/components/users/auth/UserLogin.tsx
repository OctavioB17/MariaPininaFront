import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import { Link, useNavigate } from 'react-router-dom'
import { JSX, useState } from 'react'
import { IUserLogin, IUserNoPassword } from '../../../interfaces/IUser'
import axios, { AxiosResponse } from 'axios'
import { variables } from '../../../config/variables'
import Cookies from 'js-cookie'
import apiError from '../../interfaces/ApiError'
import { setUser } from '../../../store/userSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import IJwtLoginTokens from '../../interfaces/IJwtLoginTokens'


const UserLogin: React.FC = (): JSX.Element => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [loginData, setLoginData] = useState<IUserLogin>({
    email: '',
    password: ''
  })

  const [loginError, setLoginError] = useState<string | null>(null)

  const [imageLoad, setImageLoad] = useState<boolean>(false)

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  const login = async (user: IUserLogin): Promise<void> => {
    setIsLoggingIn(true)
    try {
      const apiResponse: AxiosResponse<IJwtLoginTokens | apiError> = await axios.post(`${variables.backendIp}/login/local`, user)
      const token = apiResponse.data
      if (token && 'refreshToken' in token && 'accessToken' in token) {
        const accessToken = token.accessToken
        const refreshToken = token.refreshToken
        const isJWT = accessToken.split('.').length === 3
        if (isJWT) {
          const userResponse: AxiosResponse<IUserNoPassword> = await axios.get(`${variables.backendIp}/users/find/no-password/me`, {
            headers: {
                  Authorization: `Bearer ${accessToken}`
              }
            })
            const user = userResponse.data
            if (user) {
              const expiresInRefreshToken = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
              const expiresInAccessToken = new Date(new Date().getTime() + 15 * 60 * 1000);
              Cookies.set('token', accessToken, { expires: expiresInAccessToken })
              Cookies.set('refreshToken', refreshToken, { expires: expiresInRefreshToken }); 
              sessionStorage.setItem('name', user.name)
              sessionStorage.setItem('surname', user.surname)
              dispatch(setUser(user));
              navigate('/')
            }
          return
        }
      }
  
      setLoginError('Invalid user data')
  
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiData = error.response.data as apiError
        setLoginError(apiData.message || 'Server error.')
      } else {
        setLoginError('Error to connect to server.')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }


  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw', paddingBottom: '3vw'}}>
            <NormalBox sx={{display: 'flex', width: '70vw', height: '80vh', justifyContent: 'space-evenly', padding: 0}}>
              {
                imageLoad ?
                  <>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5vw', width: '17vw', gap: '2vw'}}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1vw' }}>
                        <Typography sx={{ paddingBottom: '1vw', fontSize: '3vw', textAlign: 'left' }}>
                          Log in
                        </Typography>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                          <Typography sx={{ textAlign: 'left' }}>
                            E-mail
                          </Typography>
                          <TextField type='email' onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} sx={{width: '100%'}}/>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                          <Typography sx={{ textAlign: 'left' }}>
                            Password
                          </Typography>
                          <TextField type='password' onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} sx={{width: '100%'}}/>
                        </Box>
                      </Box>
                      <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                      {loginError && (
                        <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
                          {loginError}
                        </Typography>
                        )
                      }
                        <Button onClick={() => (login(loginData))}  sx={{color: 'inherit', border: '1px solid #0d3e45', width: '100%', padding: '0.8vw'}}>
                            { isLoggingIn ? <CircularProgress size={22} sx={{color: 'primary.contrastText'}}/> :  'Log in'  }
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Link to={'/register'} style={{ color: 'inherit'}}>
                            <Typography>
                              Register
                            </Typography>
                          </Link>
                          <Link to={'/reset-password'} style={{ color: 'inherit'}}>
                            <Typography>
                              Forgot passoword
                            </Typography>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  <Box onLoad={() => setImageLoad(true) } component='img' alt='pinina' src='../src/assets/pinina.webp' sx={{width: '33.5vw'}}/>
                </>
                :
                <>
                  <Box sx={{ width: '33.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{color: 'primary.contrastText'}}/>
                    <Box
                      component='img'
                      alt='pinina'
                      src='../src/assets/pinina.webp'
                      onLoad={() => setImageLoad(true)}
                      sx={{
                        width: '100%',
                        display: 'none',
                      }}
                    />
                  </Box>
                </>
              }
            </NormalBox>
        </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default UserLogin