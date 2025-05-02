import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import { Box, Button, TextField, Typography } from '@mui/material'
import NormalBox from '../reusable/NormalBox'

const UserLogin = () => {
  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{width: '100%', bgcolor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw', paddingBottom: '3vw'}}>
            <NormalBox sx={{display: 'flex', flexDirection: 'column', gap: '1vw', padding: '4vw'}}>
                <Typography>
                  Log in
                </Typography>
                <TextField
  variant="standard"
  slotProps={{ input: { style: { border: 'none', outline: 'none' } } }}
  sx={{ border: '2px solid black', borderRadius: '10px', padding: '5px' }}
/>
                <TextField/>
                <Box>
                  <Button>
                     Log in
                  </Button>
                </Box>
            </NormalBox>
        </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default UserLogin