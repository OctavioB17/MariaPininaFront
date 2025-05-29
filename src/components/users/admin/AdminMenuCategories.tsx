import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import AdminTable from './AdminTable';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Backdrop, CircularProgress, useMediaQuery } from '@mui/material';
import ICategory from '../../../interfaces/ICategories';
import { theme } from '../../../config/ThemeConfig';

const AdminMenuCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
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
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    categoryId: '',
    categoryName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      open: true,
      categoryId: id,
      categoryName: name
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${variables.backendIp}/categories/delete/${deleteDialog.categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setRefreshKey(prev => prev + 1);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error to delete category:', error);
      setSnackbar({
        open: true,
        message: 'Error to delete category',
        severity: 'error'
      });
    } finally {
      setDeleteDialog(prev => ({ ...prev, open: false }));
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  };

  const handleUpdateCategory = async (id: string, data: { name?: string; description?: string }) => {
    setIsUpdating(true);
    try {
      await axios.patch(
        `${variables.backendIp}/categories/update/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setRefreshKey(prev => prev + 1);
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error to update category:', error);
      setSnackbar({
        open: true,
        message: 'Error to update category',
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: isMobile ? 50 : 70,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: isMobile ? 120 : 200,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      preProcessEditCellProps: (params) => {
        const hasError = !params.props.value || params.props.value.length < 3;
        return { ...params.props, error: hasError };
      }
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: isMobile ? 150 : 300,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      preProcessEditCellProps: (params) => {
        const hasError = !params.props.value || params.props.value.length < 3;
        return { ...params.props, error: hasError };
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Date created', 
      width: isMobile ? 150 : 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: Date) => {
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
      width: isMobile ? 80 : 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(params.row.id, params.row.name);
          }}
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '4vw' : 'inherit'
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<IPaginationResponse<ICategory>> = await axios.get(
        `${variables.backendIp}/categories/get/all`, {
          params: {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setCategories(response.data.data);
      const hasMoreData = response.data.data.length === paginationModel.pageSize;
      const currentTotal = paginationModel.page * paginationModel.pageSize + response.data.data.length;
      setRowCount(hasMoreData ? currentTotal + 1 : currentTotal);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching categories',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshKey]);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked category:', params.row);
  };

  const processRowUpdate = async (newRow: Record<string, unknown>, oldRow: Record<string, unknown>) => {
    const updatedData: { name?: string; description?: string } = {};
    
    if (newRow.name !== oldRow.name) {
      updatedData.name = newRow.name as string;
    }
    if (newRow.description !== oldRow.description) {
      updatedData.description = newRow.description as string;
    }

    if (Object.keys(updatedData).length > 0) {
      await handleUpdateCategory(newRow.id as string, updatedData);
    }

    return newRow;
  };

  return (
    <>
      <AdminTable
        columns={columns}
        rows={categories.map(category => ({
          ...category,
          id: category.id.toString(),
        }))}
        title="Categories management"
        loading={loading}
        onRowClick={handleRowClick}
        sx={{ 
          paddingBottom: isMobile ? '15vw' : '3.2vw', 
          width: isMobile ? '90vw' : '76vw',
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '3vw' : 'inherit'
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: isMobile ? '3.5vw' : 'inherit'
          },
          '& .MuiTablePagination-root': {
            fontSize: isMobile ? '3vw' : 'inherit'
          }
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        processRowUpdate={processRowUpdate}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            width: isMobile ? '90vw' : 'auto',
            '& .MuiDialogTitle-root': {
              fontSize: isMobile ? '4vw' : 'inherit'
            },
            '& .MuiDialogContentText-root': {
              fontSize: isMobile ? '3vw' : 'inherit'
            },
            '& .MuiButton-root': {
              fontSize: isMobile ? '3vw' : 'inherit'
            }
          }
        }}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{deleteDialog.categoryName}"? 
            This will delete all posts associated with this category and this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDeleting || isUpdating}
      >
        <CircularProgress size={isMobile ? '10vw' : 'inherit'} color="inherit" />
      </Backdrop>
    </>
  );
};

export default AdminMenuCategories;