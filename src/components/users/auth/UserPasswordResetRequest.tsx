import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import { JSX, useState } from 'react'
import axios from 'axios'
import { variables } from '../../../config/variables'
import apiError from '../../interfaces/ApiError'
import { theme } from '../../../config/ThemeConfig'

const UserPasswordResetRequest: React.FC = (): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [imageLoad, setImageLoad] = useState<boolean>(false)
  const [mail, setMail] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [apiCall, setApiCall] = useState<boolean>(false)

  const sendPassRequest = async (): Promise<void> => {
    setApiCall(true)
    try {
        const apiResponse = await axios.post(`${variables.backendIp}/users/change/password-reset-request`, { email: mail })
        if (apiResponse.data) {
            setSuccessMessage('A recovery email has been sent to you')
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const apiData = error.response.data as apiError
            setSuccessMessage(apiData.message || 'Failed to sent a recovery mail, please contact with mpininaapp@gmail.com')
          }
    } finally {
        setApiCall(false)
    }
  }

  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: isMobile ? '6vw' : '3vw', paddingBottom: isMobile ? '6vw' : '3vw'}}>
            <NormalBox sx={{
                display: 'flex', 
                width: isMobile ? '90vw' : '70vw', 
                height: isMobile ? 'auto' : '80vh', 
                justifyContent: 'space-evenly', 
                padding: 0,
                flexDirection: isMobile ? 'column' : 'row',
                border: isMobile ? 'none' : '2px solid #0d3e45'
            }}>
              {
                imageLoad ?
                    <>
                    <Box sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        paddingLeft: isMobile ? '5vw' : '5vw', 
                        width: isMobile ? '80vw' : '25vw', 
                        gap: isMobile ? '4vw' : '2vw',
                        paddingTop: isMobile ? '4vw' : 0,
                        paddingBottom: isMobile ? '4vw' : 0
                    }}>
                        <Box>
                            <Typography sx={{ paddingBottom: isMobile ? '2vw' : '1vw', fontSize: isMobile ? '6vw' : '3vw', textAlign: 'left' }}>
                            Reset password
                            </Typography>
                            <Typography sx={{ fontSize: isMobile ? '3.5vw' : '1vw', textAlign: 'left' }}>
                                Enter your email to send a password recovery email.
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? '2vw' : '1vw'}}>
                          <Typography sx={{ textAlign: 'left', fontSize: isMobile ? '3.5vw' : 'inherit' }}>
                            E-mail
                          </Typography>
                          <TextField 
                            type='email' 
                            onChange={(e) => setMail(e.target.value)} 
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: isMobile ? '3.5vw' : 'inherit'
                                }
                            }}
                          />
                        </Box>
                        <Button 
                            disabled={!mail} 
                            onClick={() => sendPassRequest()}  
                            sx={{
                                color: 'inherit', 
                                border: '1px solid #0d3e45', 
                                width: '100%', 
                                padding: isMobile ? '1.6vw' : '0.8vw',
                                fontSize: isMobile ? '3.5vw' : 'inherit'
                            }}
                        >
                            { apiCall ? <CircularProgress size={isMobile ? 30 : 22} sx={{color: 'primary.contrastText'}}/> :  'Reset Password'  }
                        </Button>
                        {
                            successMessage ??
                            <Typography sx={{fontSize: isMobile ? '3.5vw' : 'inherit'}}>
                                {successMessage}
                            </Typography>
                        }
                    </Box>
                    <Box 
                        onLoad={() => setImageLoad(true)} 
                        component='img' 
                        alt='pinina' 
                        src='../src/assets/pinina.webp' 
                        sx={{
                            width: isMobile ? '90vw' : '33.5vw',
                            height: isMobile ? 'auto' : 'auto',
                            marginTop: isMobile ? '4vw' : 0,
                            marginBottom: isMobile ? '4vw' : 0,
                            display: isMobile ? 'none' : 'block'
                        }}
                    />
                    </>
                :
                  <Box sx={{ width: isMobile ? '90vw' : '33.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{color: 'primary.contrastText'}}/>
                    <Box
                      component='img'
                      src='../src/assets/pinina.webp'
                      onLoad={() => setImageLoad(true)}
                      sx={{
                        width: '100%',
                        display: 'none',
                      }}
                    />
                  </Box>
              }
            </NormalBox>
        </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default UserPasswordResetRequest