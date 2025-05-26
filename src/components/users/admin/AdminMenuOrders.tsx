import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import AdminTable from './AdminTable';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { Order } from '../../../interfaces/IOrders';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import { Snackbar, Alert } from '@mui/material';

const AdminMenuOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      valueGetter: (params) => params.value || 'Pending'
    },
    { 
      field: 'totalPrice', 
      headerName: 'Total Price', 
      width: 130,
      valueGetter: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Payment Method', 
      width: 150 
    },
    {
      field: 'products',
      headerName: 'Products',
      width: 400,
      valueGetter: (params) => {
        const products = params.value || [];
        return products.map((product: any) => 
          `ID: ${product.id} | Name: ${product.name} | Price: $${product.price} | SKU: ${product.sku} | Quantity: ${product.quantity}`
        ).join('\n');
      },
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'user', 
      headerName: 'User', 
      width: 200,
      valueGetter: (params) => `${params.value?.name} ${params.value?.surname}`
    },
    { 
      field: 'createdAt', 
      headerName: 'Date created', 
      width: 200,
      valueGetter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<IPaginationResponse<Order>> = await axios.get(
        `${variables.backendIp}/orders/find`, {
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
  }, [fetchOrders, refreshKey]);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked order:', params.row);
  };

  return (
    <>
      <AdminTable
        columns={columns}
        rows={orders.map(order => ({
          ...order,
          id: order.id.toString(),
        }))}
        title="Orders management"
        loading={loading}
        onRowClick={handleRowClick}
        sx={{ paddingBottom: '3.2vw', width: '76vw' }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
      />

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
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminMenuOrders;