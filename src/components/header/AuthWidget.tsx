import { Avatar, Box, MenuItem, Paper, Popper, Typography } from '@mui/material'
import React, { useState } from 'react'
import Face5Icon from '@mui/icons-material/Face5'
import Face6Icon from '@mui/icons-material/Face6'
import { Link } from 'react-router-dom'
import { useUserLogout } from '../../hooks/useUserLogout'
import useIsLogged from '../../hooks/useIsLogged'
import { selectUser } from '../../store/userSlice'
import { useAppSelector } from '../../hooks/useAppSelector'

const AuthWidget: React.FC = () => {

  const logout = useUserLogout()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null); 
    logout()
  };

  const name = sessionStorage.getItem('name')
  const surname = sessionStorage.getItem('surname')
  const user = useAppSelector(selectUser);

  const isLogged = useIsLogged()

  const stringToColor = (string: string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  const stringAvatar = (name: string, surname: string) => {
    return {
      sx: {
        bgcolor: stringToColor(name + surname),
        color: '#fff'
      },
      children: `${name[0]}${surname[0]}`.toUpperCase()
    }
  }

  const CatAvatar = () => {
    const color = stringToColor(name! + surname!)
  
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
            transform: 'rotate( 20deg)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            zIndex: 1,
          }}
        />
      </Box>
    )
  }

  return (
    <Box>
      {isLogged ? (
        <Box sx={{ display: 'flex', color: 'primary.contrastText', alignItems: 'center' }} onClick={handleClick}>
          <CatAvatar />
          <Typography>{`${name} ${surname}`}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: '1vw', color: 'primary.contrastText' }}>
          <Link to="/login" style={{ display: 'flex', gap: '1vw', alignItems: 'center', color: '#0d3e45' }}>
            <Typography variant="h4">Log-in</Typography>
            <Face5Icon />
          </Link>
          <Link to="/register" style={{ display: 'flex', gap: '1vw', alignItems: 'center', color: '#0d3e45' }}>
            <Typography variant="h4">Sign-in</Typography>
            <Face6Icon />
          </Link>
        </Box>
      )}
      <Popper id={id} open={open} anchorEl={anchorEl} placement='bottom-end' disablePortal sx={{zIndex: 99}}>
        <Paper elevation={4} sx={{ mt: 1, p: 1, backgroundColor: 'primary.main', color: 'primary.contrastText', border: '2px solid #0d3e45' }}>
          <MenuItem component={Link} to="/orders">Orders</MenuItem>
          <MenuItem component={Link} to={`${user?.id}/publications`}>Publications</MenuItem>
          {user && (user.role === 'ADMIN' || user.role === 'MODERATOR' || user.role === 'SUPER_ADMIN') && (
            <MenuItem>Admin menu</MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Paper>
      </Popper>
    </Box>
  );
}

export default AuthWidget
