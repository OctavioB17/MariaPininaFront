import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import AdminTable from './AdminTable';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { IProduct } from '../../../interfaces/IProducts';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const AdminMenuProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [rowCount, setRowCount] = useState(0);

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(
        `${variables.backendIp}/products/delete/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error trying to delete product:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userId', headerName: 'User ID', width: 70 },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      editable: true,
      type: 'string'
    },
    { 
      field: 'sku', 
      headerName: 'SKU', 
      width: 150,
      editable: true,
      type: 'string'
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      editable: true,
      type: 'number',
      valueGetter: (params: number) => `$${params.toFixed(2)}`,
      valueSetter: (params) => {
        const value = params.value.toString().replace('$', '');
        return Number(value);
      }
    },
    { 
      field: 'stock', 
      headerName: 'Stock', 
      width: 100,
      editable: true,
      type: 'number'
    },
    { 
      field: 'isPaused', 
      headerName: 'Status', 
      width: 130,
      valueGetter: (params: boolean) => params ? 'Paused' : 'Active'
    },
    { 
      field: 'createdAt', 
      headerName: 'Date created', 
      width: 200,
      valueGetter: (params: string) => {
        if (!params) return '';
        return new Date(params).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteProduct(params.row.id);
          }}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const processRowUpdate = async (newRow: Record<string, unknown>, oldRow: Record<string, unknown>) => {
    try {
      const formData = new FormData();
      const changedField = Object.keys(newRow).find(key => newRow[key] !== oldRow[key]);
      
      if (changedField) {
        formData.append(changedField, newRow[changedField]?.toString() || '');

        await axios.patch(
          `${variables.backendIp}/products/update/${newRow.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setRefreshKey(prev => prev + 1);
      }
      return newRow;
    } catch (error) {
      console.error('Error updating product:', error);
      return oldRow;
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<IPaginationResponse<IProduct>> = await axios.get(
        `${variables.backendIp}/products/get-all/random`, {
          params: {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setProducts(response.data.data);
      const hasMoreData = response.data.data.length === paginationModel.pageSize;
      const currentTotal = paginationModel.page * paginationModel.pageSize + response.data.data.length;
      setRowCount(hasMoreData ? currentTotal + 1 : currentTotal);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshKey]);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked product:', params.row);
  };

  return (
    <AdminTable
      columns={columns}
      rows={products.map(product => ({
        ...product,
        id: product.id.toString(),
      }))}
      title="Products management"
      loading={loading}
      onRowClick={handleRowClick}
      sx={{ paddingBottom: '3.2vw', width: '76vw' }}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rowCount={rowCount}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default AdminMenuProducts;