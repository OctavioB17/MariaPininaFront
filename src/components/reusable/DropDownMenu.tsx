import React, { useRef, useState } from 'react'
import { Button, Popper, Paper, MenuItem, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import DropDownMenuProps from '../interfaces/reusable/DropDownMenuProps'
import { muiButtonNoAnimations } from '../../themes/MuiButtonNoAnimations'

const DropDownMenu: React.FC<DropDownMenuProps> = ({ menuName, menuList, linkTo, queryParamName }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  const itemsPerColumn = 10
  const columns = Math.ceil(menuList.length / itemsPerColumn)

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link to={linkTo}>
        <Button
            ref={buttonRef}
            aria-controls={open ? 'dropdown-popper' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={muiButtonNoAnimations}
        >
            {menuName}
        </Button>  
      </Link>

      <Popper
        id="dropdown-popper"
        open={open}
        anchorEl={buttonRef.current}
        placement="bottom-start"
        disablePortal
        style={{ zIndex: 1300 }}
      >
        <Paper
          elevation={4}
          sx={{
            mt: 1,
            p: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, auto)`,
            gap: 1,
            maxWidth: '80vw',
            overflowX: 'auto',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            border: '2px solid #0d3e45'
          }}
        >
          {menuList.map((item) => (
            <MenuItem
              key={item}
              component={Link}
              to={`${linkTo}?${queryParamName}=${encodeURIComponent(item)}`} 
              onClick={() => setOpen(false)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {item}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    </Box>
  )
}

export default DropDownMenu
