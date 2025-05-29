import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import { Link } from 'react-router-dom'
import { JSX, useMemo, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { variables } from '../../../config/variables'
import apiError from '../../interfaces/ApiError'
import { IUserRegister } from '../../../interfaces/IUser'

const UserRegister: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [registerData, setRegisterData] = useState<IUserRegister>({
    name: "",
    surname: "",
    email: "",
    password: ""
  })

  const [registerError, setRegisterError] = useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [imageLoad, setImageLoad] = useState<boolean>(false)

  const [registerSuccessful, setRegisterSuccessful] = useState<boolean>(false)

  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null)

  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const confirmPasswordError = confirmPassword !== registerData.password ? "Passwords do not match" : null

  const validateField = (name: string, value: string, fullData: typeof registerData): string => {
    switch (name) {
      case 'name':
        if (!value || value.length < 2 || /\d/.test(value)) {
          return 'Name must contain 2 characters and no numbers'
        }
        break
      case 'surname':
        if (!value || value.length < 2 || /\d/.test(value)) {
          return 'Surname must contain 2 characters and no numbers'
        }
        break
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Not valid email.'
        }
        break
      case 'password':
        if (!value || value.length < 6) {
          return 'Password must contain at least 6 characters'
        }
        if (!/[A-Z]/.test(value)) {
          return 'Password must contain a capital letter'
        }
        if (!/[a-z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          return 'Password must contain lower cases and special characters'
        }
        break
      case 'confirmPassword':
        if (value !== fullData.password) {
          return `Passwords doesn't match` 
        }
        break
    }
  
    return ''
  }

  const isDisabled = useMemo(() => {
    return Object.values(fieldErrors).some(arr => arr.length > 0)
      || Object.values(registerData).some(v => !v)
      || !confirmPassword;
  }, [fieldErrors, registerData, confirmPassword]);
  
  const register = async (user: IUserRegister): Promise<void> => {
    setRegisterSuccessful(true)
    try {
      const apiResponse: AxiosResponse<string | apiError> = await axios.post(`${variables.backendIp}/users/register`, user)
  
      if (apiResponse.data) {
        setRegisterSuccessMessage('Successfully registered. An email was sent to confirm your account')
        return
      }
  
      setRegisterError('Invalid user data')
  
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            setRegisterError( error.response.data.message || 'Check the errors in each field')
          }
    } finally {
      setRegisterSuccessful(false)
    }
  }


  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          paddingTop: isMobile ? '8vw' : '3vw', 
          paddingBottom: isMobile ? '8vw' : '3vw'
        }}>
            <NormalBox sx={{
              display: 'flex', 
              width: isMobile ? '90vw' : '80vw', 
              justifyContent: 'space-evenly', 
              padding: isMobile ? '4vw' : 0,
              flexDirection: isMobile ? 'column' : 'row',
              border: isMobile ? 'none' : '2px solid #0d3e45'
            }}>
              {
                imageLoad || isMobile ?
                  <>
                    {!isMobile && (
                      <Box 
                        onLoad={() => setImageLoad(true)} 
                        alt='pinina' 
                        component='img' 
                        src='../src/assets/pinina2.webp' 
                        sx={{width: '40vw'}}
                      />
                    )}
                    <Box sx={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      width: isMobile ? '100%' : '30vw', 
                      gap: isMobile ? '4vw' : '2vw', 
                      paddingTop: isMobile ? '2vw' : '2vw', 
                      paddingBottom: isMobile ? '2vw' : '2vw'
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw' }}>
                        <Typography sx={{ 
                          paddingBottom: isMobile ? '2vw' : '1vw', 
                          fontSize: isMobile ? '10vw' : '3vw', 
                          textAlign: 'left' 
                        }}>
                          Register
                        </Typography>
                        <Box sx={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          gap: isMobile ? '2vw' : '1vw',
                          flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <Box sx={{
                              display: 'flex', 
                              gap: isMobile ? '2vw' : '1vw', 
                              flexDirection: 'column', 
                              width: isMobile ? '100%' : '15vw'
                            }}>
                                <Typography sx={{ 
                                  textAlign: 'left',
                                  fontSize: isMobile ? '1rem' : 'inherit'
                                }}>
                                    Name
                                </Typography>
                                <TextField 
                                    type='text'
                                    error={fieldErrors.name?.length > 0} 
                                    helperText={fieldErrors.name?.join(' - ')} 
                                    onChange={(e) => {
                                        const value = e.target.value
                                        const newData = { ...registerData, name: value }
                                        setRegisterData(newData)
                                        
                                        const error = validateField('name', value, newData)
                                        setFieldErrors(prev => ({ ...prev, name: error ? [error] : [] }))
                                    }} 
                                    sx={{width: '100%'}}
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Box>
                            <Box sx={{
                              display: 'flex', 
                              gap: isMobile ? '2vw' : '1vw', 
                              flexDirection: 'column', 
                              width: isMobile ? '100%' : '15vw'
                            }}>
                                <Typography sx={{ 
                                  textAlign: 'left',
                                  fontSize: isMobile ? '1rem' : 'inherit'
                                }}>
                                    Surname
                                </Typography>
                                <TextField 
                                    type='text' 
                                    error={fieldErrors.surname?.length > 0} 
                                    helperText={fieldErrors.surname?.join(' - ')} 
                                    onChange={(e) => {
                                        const value = e.target.value
                                        const newData = { ...registerData, surname: value }
                                        setRegisterData(newData)
                                        
                                        const error = validateField('surname', value, newData)
                                        setFieldErrors(prev => ({ ...prev, surname: error ? [error] : [] }))
                                    }} 
                                    sx={{width: '100%'}}
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw'}}>
                          <Typography sx={{ 
                            textAlign: 'left',
                            fontSize: isMobile ? '1rem' : 'inherit'
                          }}>
                            E-mail
                          </Typography>
                          <TextField 
                            error={fieldErrors.email?.length > 0} 
                            helperText={fieldErrors.email?.join(' - ')} 
                            type='email'
                            onChange={(e) => {
                                const value = e.target.value
                                const newData = { ...registerData, email: value }
                                setRegisterData(newData)
                                
                                const error = validateField('email', value, newData)
                                setFieldErrors(prev => ({ ...prev, email: error ? [error] : [] }))
                            }}  
                            sx={{width: '100%'}}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw'}}>
                          <Typography sx={{ 
                            textAlign: 'left',
                            fontSize: isMobile ? '1rem' : 'inherit'
                          }}>
                            Password
                          </Typography>
                          <TextField 
                            type='password' 
                            error={fieldErrors.password?.length > 0} 
                            helperText={fieldErrors.password?.join(' - ')}
                            onChange={(e) => {
                                const value = e.target.value
                                const newData = { ...registerData, password: value }
                                setRegisterData(newData)
                                
                                const error = validateField('password', value, newData)
                                setFieldErrors(prev => ({ ...prev, password: error ? [error] : [] }))
                            }}  
                            sx={{width: '100%'}}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw'}}>
                          <Typography sx={{ 
                            textAlign: 'left',
                            fontSize: isMobile ? '1rem' : 'inherit'
                          }}>
                            Confirm password
                          </Typography>
                          <TextField 
                            error={fieldErrors.confirmPasswordError?.length > 0} 
                            helperText={confirmPasswordError} 
                            onChange={(e) => {
                                const value = e.target.value
                                setConfirmPassword(value)
                                const error = validateField('confirmPasswordError', value, registerData)
                                setFieldErrors(prev => ({ ...prev, confirmPasswordError: error ? [error] : [] }))
                            }} 
                            type='password' 
                            sx={{width: '100%'}}
                            size={isMobile ? 'small' : 'medium'}
                           />
                        </Box>
                      </Box>
                      <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw'}}>
                      {registerError && (
                        <Typography sx={{ 
                          color: 'red', 
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.9rem' : 'inherit'
                        }}>
                          {registerError}
                        </Typography>
                        )
                      }
                        {
                          registerSuccessMessage ?
                          <Typography sx={{
                            textDecoration: 'underline',
                            fontSize: isMobile ? '0.9rem' : 'inherit'
                          }}>
                            {registerSuccessMessage}
                          </Typography>
                          :
                          <Button 
                            disabled={isDisabled} 
                            onClick={() => (register(registerData))}  
                            sx={{
                              color: 'inherit', 
                              border: '1px solid #0d3e45', 
                              width: '100%', 
                              padding: isMobile ? '3vw' : '0.8vw',
                              fontSize: isMobile ? '1rem' : 'inherit'
                            }}
                          >
                            { registerSuccessful ? 
                              <CircularProgress size={isMobile ? 20 : 22} sx={{color: 'primary.contrastText'}}/> 
                              : 'Register' 
                            }
                          </Button>
                        }
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: isMobile ? '0.9rem' : 'inherit'
                        }}>
                          <Link to={'/login'} style={{ color: 'inherit'}}>
                            <Typography sx={{ fontSize: isMobile ? '0.9rem' : 'inherit' }}>
                              Already have account
                            </Typography>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
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

export default UserRegister