import React, { useState, useEffect, useCallback } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { Order } from '../../../interfaces/IOrders';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import { Snackbar, Alert, Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, CircularProgress, useMediaQuery } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { theme } from '../../../config/ThemeConfig';

const OrderRow = ({ order, isMobile }: { order: Order; isMobile: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpen(!open)}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: isMobile ? '4vw' : 'inherit'
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{order.id}</TableCell>
        <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{order.status || 'Pending'}</TableCell>
        <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>${order.totalPrice}</TableCell>
        <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{order.paymentMethod}</TableCell>
        <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{`${order.user?.name || ''} ${order.user?.surname || ''}`}</TableCell>
        <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{order.taxes.map((tax) => `$${tax.number.toFixed(2)}`).join(' - ')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                component="div"
                sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}
              >
                Products
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>ID</TableCell>
                    <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>Name</TableCell>
                    <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>SKU</TableCell>
                    <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>Price</TableCell>
                    <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{product.id}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{product.name}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{product.sku}</TableCell>
                      <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>${product.price.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>{product.quantity}</TableCell>
                      <TableCell align="right" sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}>${(product.price * product.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AdminMenuOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: isMobile ? 5 : 10,
    page: 0,
  });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPaginationModel(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaginationModel(prev => ({ 
      ...prev, 
      pageSize: parseInt(event.target.value, 10),
      page: 0 
    }));
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<IPaginationResponse<Order>> = await axios.get(
        `${variables.backendIp}/orders/find/all`, {
          params: {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setOrders(response.data.data);
      const hasMoreData = response.data.data.length === paginationModel.pageSize;
      const currentTotal = paginationModel.page * paginationModel.pageSize + response.data.data.length;
      setRowCount(hasMoreData ? currentTotal + 1 : currentTotal);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching orders',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <TableContainer 
        component={Paper} 
        sx={{ 
          width: isMobile ? '90vw' : '76vw', 
          marginBottom: isMobile ? '15vw' : '3.2vw', 
          position: 'relative',
          '& .MuiTableCell-head': {
            fontSize: isMobile ? '3.5vw' : 'inherit'
          },
          '& .MuiTablePagination-root': {
            fontSize: isMobile ? '3vw' : 'inherit'
          }
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress size={isMobile ? '10vw' : 'inherit'} />
          </Box>
        )}
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Price</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Taxes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} isMobile={isMobile} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowCount}
          rowsPerPage={paginationModel.pageSize}
          page={paginationModel.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            border: '1px solid',
            borderColor: 'primary.contrastText',
            '& .MuiAlert-icon': {
              color: 'primary.contrastText'
            },
            fontSize: isMobile ? '3vw' : 'inherit'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminMenuOrders;