import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ISxProps } from '../../interfaces/SxProps';

const AdminMenuList: React.FC<ISxProps> = ({sx}) => {

    const navigate = useNavigate()
    const [openCategories, setOpenCategories] = useState(false);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, borderRight: '1px solid #0d3e45', paddingRight: 2, paddingLeft: 2, padding: '1vw', ...sx}}>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left', width: '100%'}}>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: '100%', cursor: 'pointer'}}>
                <PersonIcon />
                <Typography sx={{color: 'inherit'}} onClick={() => navigate('/admin/users')}>
                    Users
                </Typography>
            </Box>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: '100%', cursor: 'pointer'}}>
                <InventoryIcon />
                <Typography sx={{color: 'inherit'}} onClick={() => navigate('/admin/products')}>
                    Products
                </Typography>
            </Box>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: '100%', cursor: 'pointer'}}>
                <CategoryIcon />
                <Typography sx={{color: 'inherit', flexGrow: 1}}>
                    Categories
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => setOpenCategories(!openCategories)}
                >
                    {openCategories ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </Box>
            <Collapse in={openCategories} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => navigate('/admin/categories')}
                    >
                        <ListItemIcon>
                            <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText primary="View" />
                    </ListItemButton>
                    <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => navigate('/admin/create-category')}
                    >
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create" />
                    </ListItemButton>
                </List>
            </Collapse>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', width: '100%', cursor: 'pointer'}}>
                <ShoppingCartIcon />
                <Typography sx={{color: 'inherit'}} onClick={() => navigate('/admin/orders')}>
                Orders
                </Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default AdminMenuList