import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import React, { JSX, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { variables } from '../../../config/variables';
import apiError from '../../interfaces/ApiError';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import NormalBox from '../../reusable/NormalBox';

const UserPasswordChange: React.FC = (): JSX.Element => {

  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');

  const navigate = useNavigate()

  const [password, setPassword] = useState<string | null>(null)

  const [registerError, setRegisterError] = useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [imageLoad, setImageLoad] = useState<boolean>(false)

  const [passChangeSuccessful, setPassChangeSuccessful] = useState<boolean>(false)

  const [apiResponseSuccess, setApiResponseSuccess] = useState<boolean>(false)

  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<boolean>(false)

  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [count, setCount] = useState<number>(7)

  const confirmPasswordError = password && confirmPassword && confirmPassword !== password ? "Passwords do not match" : null;
  const validateField = (name: string, value: string, fullData: string): string => {
    switch (name) {
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
        if (value !== fullData) {
          return `Passwords doesn't match` 
        }
        break
    }
  
    return ''
  }

  useEffect(() => {
    if (apiResponseSuccess) {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);

        return () => clearInterval(interval);
    }
  }, [apiResponseSuccess]);

  useEffect(() => {
    if (count === 0) {
        navigate('/login')
    }
  }, [count, navigate])

  const isDisabled = useMemo(() => {
    const hasErrors = Object.values(fieldErrors).some(arr => arr.length > 0);
    const isIncomplete = !password || !confirmPassword;
    const hasMismatch = confirmPassword !== password;
  
    return hasErrors || isIncomplete || hasMismatch;
  }, [fieldErrors, password, confirmPassword]);
  
  const resetPassword = async (): Promise<void> => {
    setPassChangeSuccessful(true)
    try {
      const apiResponse: AxiosResponse<string | apiError> = await axios.patch(`${variables.backendIp}/users/change/password/?token=${token}`, { password: password }, { headers: {
        Authorization: `Bearer ${token}`
      }})
  
      if (apiResponse.data) {
        setRegisterSuccessMessage(true)
        setApiResponseSuccess(true)
        return
      }
  
      setRegisterError('Invalid user data')
  
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {

            setRegisterError( error.response.data.message || 'Server error')
          }
    } finally {
      setPassChangeSuccessful(false)
    }
  }


  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw', paddingBottom: '3vw'}}>
            <NormalBox sx={{display: 'flex', width: '80vw', justifyContent: 'space-evenly', padding: 0}}>
              {
                imageLoad ?
                  <>
                  <Box onLoad={() => setImageLoad(true) } component='img' alt='pinina' src='../src/assets/pinina2.webp' sx={{width: '40vw'}}/>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '30vw', gap: '2vw', paddingTop: '2vw', paddingBottom: '2vw'}}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1vw' }}>
                        <Typography sx={{ paddingBottom: '1vw', fontSize: '3vw', textAlign: 'left' }}>
                          Reset password
                        </Typography>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                          <Typography sx={{ textAlign: 'left' }}>
                            Password
                          </Typography>
                          <TextField 
                            type='password' 
                            error={fieldErrors.password?.length > 0} 
                            helperText={fieldErrors.password?.join(' - ')}
                            onChange={(e) => {
                                const value = e.target.value
                                setPassword(value)
                                
                                const error = validateField('password', value, confirmPassword)
                                setFieldErrors(prev => ({ ...prev, password: error ? [error] : [] }))
                            }}  
                            sx={{width: '100%'}}
                          />
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                          <Typography sx={{ textAlign: 'left' }}>
                            Confirm password
                          </Typography>
                          <TextField 
                            error={fieldErrors.confirmPasswordError?.length > 0} 
                            helperText={confirmPasswordError} 
                            onChange={(e) => {
                                const value = e.target.value
                                setConfirmPassword(value)
                                const error = validateField('confirmPasswordError', value, password || "")
                                setFieldErrors(prev => ({ ...prev, confirmPasswordError: error ? [error] : [] }))
                            }} 
                            type='password' 
                            sx={{width: '100%'}}
                           />
                        </Box>
                      </Box>
                      <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                      {registerError && (
                        <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
                          {registerError}
                        </Typography>
                        )
                      }
                        {
                          registerSuccessMessage ?
                          <Typography sx={{textDecoration: 'underline'}}>Password successfully changed. Redirecting to email in {count}...</Typography>
                          :
                          <Button disabled={isDisabled} onClick={() => resetPassword()}  sx={{color: 'inherit', border: '1px solid #0d3e45', width: '100%', padding: '0.8vw'}}>
                            { passChangeSuccessful ? <CircularProgress size={22} sx={{color: 'primary.contrastText'}}/> :  'Register'  }
                          </Button>
                        }
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Link to={'/login'} style={{ color: 'inherit'}}>
                            <Typography>
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

export default UserPasswordChange