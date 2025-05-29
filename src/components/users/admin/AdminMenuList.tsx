import { Typography, useMediaQuery, Fab } from '@mui/material'
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
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import { theme } from '../../../config/ThemeConfig';
import { AdminMenuListProps } from '../../interfaces/AdminMenuProps';

const AdminMenuList: React.FC<AdminMenuListProps> = ({sx, onClose, onOpen}) => {
    const navigate = useNavigate()
    const [openCategories, setOpenCategories] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        if (onOpen) onOpen();
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        if (onClose) onClose();
    };

    const menuContent = (
        <Box sx={{
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? 4 : 2, 
            borderRight: isMobile ? 'none' : '1px solid #0d3e45', 
            paddingRight: isMobile ? 0 : 2, 
            paddingLeft: isMobile ? 0 : 2, 
            padding: isMobile ? '4vw' : '0vw',
            width: isMobile ? '80vw' : 'auto',
            ...sx
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: isMobile ? 4 : 2, textAlign: 'left', width: '100%'}}>
                <Box sx={{
                    display: 'flex', 
                    gap: isMobile ? 2 : 1, 
                    alignItems: 'center', 
                    width: '100%', 
                    cursor: 'pointer',
                    padding: isMobile ? '2vw' : 0
                }}>
                    <PersonIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                    <Typography 
                        sx={{
                            color: 'inherit',
                            fontSize: isMobile ? '8vw' : '1.2vw'
                        }} 
                        onClick={() => {
                            navigate('/admin/users');
                            if (isMobile && onClose) onClose();
                        }}
                    >
                        Users
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex', 
                    gap: isMobile ? 2 : 1, 
                    alignItems: 'center', 
                    width: '100%', 
                    cursor: 'pointer',
                    padding: isMobile ? '2vw' : 0
                }}>
                    <InventoryIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                    <Typography 
                        sx={{
                            color: 'inherit',
                            fontSize: isMobile ? '8vw' : '1.2vw'
                        }} 
                        onClick={() => {
                            navigate('/admin/products');
                            if (isMobile && onClose) onClose();
                        }}
                    >
                        Products
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex', 
                    gap: isMobile ? 2 : 1, 
                    alignItems: 'center', 
                    width: '100%', 
                    cursor: 'pointer',
                    padding: isMobile ? '2vw' : 0
                }}>
                    <CategoryIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                    <Typography 
                        sx={{
                            color: 'inherit',
                            flexGrow: 1,
                            fontSize: isMobile ? '8vw' : '1.2vw'
                        }}
                    >
                        Categories
                    </Typography>
                    <IconButton
                        size={isMobile ? "large" : "small"}
                        onClick={() => setOpenCategories(!openCategories)}
                    >
                        {openCategories ? 
                            <KeyboardArrowUpIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} /> : 
                            <KeyboardArrowDownIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                        }
                    </IconButton>
                </Box>
                <Collapse in={openCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton 
                            sx={{ 
                                pl: isMobile ? 6 : 4,
                                padding: isMobile ? '2vw' : 'inherit'
                            }}
                            onClick={() => {
                                navigate('/admin/categories');
                                if (isMobile && onClose) onClose();
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: isMobile ? '10vw' : '2vw' }}>
                                <VisibilityIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="View" 
                                sx={{ 
                                    '& .MuiTypography-root': {
                                        fontSize: isMobile ? '8vw' : '1.2vw',
                                    }
                                }}
                            />
                        </ListItemButton>
                        <ListItemButton 
                            sx={{ 
                                pl: isMobile ? 6 : 4,
                                padding: isMobile ? '2vw' : 'inherit'
                            }}
                            onClick={() => {
                                navigate('/admin/create-category');
                                if (isMobile && onClose) onClose();
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: isMobile ? '10vw' : '2vw' }}>
                                <AddCircleOutlineIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Create" 
                                sx={{ 
                                    '& .MuiTypography-root': {
                                        fontSize: isMobile ? '8vw' : '1.2vw'
                                    }
                                }}
                            />
                        </ListItemButton>
                    </List>
                </Collapse>
                <Box sx={{
                    display: 'flex', 
                    gap: isMobile ? 2 : 1, 
                    alignItems: 'center', 
                    width: '100%', 
                    cursor: 'pointer',
                    padding: isMobile ? '2vw' : 0
                }}>
                    <ShoppingCartIcon sx={{ fontSize: isMobile ? '8vw' : '1.2vw' }} />
                    <Typography 
                        sx={{
                            color: 'inherit',
                            fontSize: isMobile ? '8vw' : '1.2vw'
                        }} 
                        onClick={() => {
                            navigate('/admin/orders');
                            if (isMobile && onClose) onClose();
                        }}
                    >
                        Orders
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <>
                <Fab
                    color="primary"
                    aria-label="menu"
                    onClick={handleDrawerOpen}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                        width: '15vw',
                        height: '15vw',
                        '& .MuiSvgIcon-root': {
                            fontSize: '8vw'
                        }
                    }}
                >
                    <MenuIcon />
                </Fab>
                <SwipeableDrawer
                    anchor="left"
                    open={isDrawerOpen}
                    onClose={handleDrawerClose}
                    onOpen={handleDrawerOpen}
                    sx={{
                        '& .MuiDrawer-paper': {
                            backgroundColor: theme.palette.background.default,
                            borderRight: 'none',
                            width: '95vw'
                        }
                    }}
                >
                    {menuContent}
                </SwipeableDrawer>
            </>
        );
    }

    return menuContent;
}

export default AdminMenuList