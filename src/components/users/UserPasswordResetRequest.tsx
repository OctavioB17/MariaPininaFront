import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import NormalBox from '../reusable/NormalBox'
import { JSX, useState } from 'react'
import axios from 'axios'
import { variables } from '../../config/variables'
import apiError from '../interfaces/ApiError'


const UserPasswordResetRequest: React.FC = (): JSX.Element => {

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
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw', paddingBottom: '3vw'}}>
            <NormalBox sx={{display: 'flex', width: '70vw', height: '80vh', justifyContent: 'space-evenly', padding: 0}}>
              {
                imageLoad ?
                    <>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5vw', width: '25vw', gap: '2vw'}}>
                        <Box>
                            <Typography sx={{ paddingBottom: '1vw', fontSize: '3vw', textAlign: 'left' }}>
                            Reset password
                            </Typography>
                            <Typography sx={{ fontSize: '1vw', textAlign: 'left' }}>
                                Enter your email to send a password recovery email.
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: '1vw'}}>
                          <Typography sx={{ textAlign: 'left' }}>
                            E-mail
                          </Typography>
                          <TextField type='email' onChange={(e) => setMail(e.target.value)} sx={{width: '100%'}}/>
                        </Box>
                        <Button disabled={!mail} onClick={() => sendPassRequest()}  sx={{color: 'inherit', border: '1px solid black', width: '100%', padding: '0.8vw'}}>
                            { apiCall ? <CircularProgress size={22} sx={{color: 'primary.contrastText'}}/> :  'Reset Password'  }
                        </Button>
                        {
                            successMessage ??
                            <Typography>
                                {successMessage}
                            </Typography>
                        }
                    </Box>
                    <Box onLoad={() => setImageLoad(true) } component='img' src='../src/assets/pinina.webp' sx={{width: '33.5vw'}}/>
                    </>
                :
                  <Box sx={{ width: '33.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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