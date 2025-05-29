import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import AdminTable from './AdminTable';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { IUser, UserRoles } from '../../../interfaces/IUser';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Popper, Paper, MenuItem, ClickAwayListener, Snackbar, Alert, useMediaQuery } from '@mui/material';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { theme } from '../../../config/ThemeConfig';

const AdminMenuUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: isMobile ? 5 : 10,
    page: 0,
  });
  const [rowCount, setRowCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  const currentUser = useAppSelector(state => state.user.user);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(
        `${variables.backendIp}/users/delete/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error to delete user:', error);
      setSnackbar({
        open: true,
        message: 'Error to delete user',
        severity: 'error'
      });
    }
  };

  const handleRoleClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      setSnackbar({
        open: true,
        message: 'You do not have permission to change roles',
        severity: 'error'
      });
      return;
    }
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleRoleChange = async (newRole: UserRoles) => {
    if (!selectedUserId) return;

    try {
      await axios.patch(
        `${variables.backendIp}/users/change/role/${selectedUserId}`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setRefreshKey(prev => prev + 1);
      setSnackbar({
        open: true,
        message: 'Role updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error to change role:', error);
      setSnackbar({
        open: true,
        message: 'Error to change role',
        severity: 'error'
      });
    } finally {
      setAnchorEl(null);
      setSelectedUserId(null);
    }
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
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
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'surname', 
      headerName: 'Surname', 
      width: isMobile ? 120 : 200,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: isMobile ? 150 : 250,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: isMobile ? 100 : 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleRoleClick(e, params.row.id);
          }}
          style={{ 
            cursor: 'pointer', 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '3vw' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Date created', 
      width: isMobile ? 150 : 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: { row: IUser }) => {
        if (!params.row?.createdAt) return '';
        return new Date(params.row.createdAt).toLocaleDateString('en-US', {
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
            handleDeleteUser(params.row.id);
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<IPaginationResponse<IUser>> = await axios.get(
        `${variables.backendIp}/users/find`, {
          params: {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize
          },
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        }
      );
      setUsers(response.data.data);
      const hasMoreData = response.data.data.length === paginationModel.pageSize;
      const currentTotal = paginationModel.page * paginationModel.pageSize + response.data.data.length;
      setRowCount(hasMoreData ? currentTotal + 1 : currentTotal);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked user:', params.row);
  };

  return (
    <>
      <AdminTable
        columns={columns}
        rows={users.map(user => ({
          ...user,
          id: user.id.toString(),
        }))}
        title="Users management"
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
      />

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={3}>
            <MenuItem 
              onClick={() => handleRoleChange('USER')}
              sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}
            >
              USER
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleChange('ADMIN')}
              sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}
            >
              ADMIN
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleChange('SUPER_ADMIN')}
              sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}
            >
              SUPER_ADMIN
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleChange('MODERATOR')}
              sx={{ fontSize: isMobile ? '3vw' : 'inherit' }}
            >
              MODERATOR
            </MenuItem>
          </Paper>
        </ClickAwayListener>
      </Popper>

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

export default AdminMenuUsers;