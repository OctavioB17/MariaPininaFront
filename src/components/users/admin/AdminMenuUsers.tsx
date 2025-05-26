import React, { useState, useEffect } from 'react';
import { GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import AdminTable from './AdminTable';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import Cookies from 'js-cookie';
import { IUser } from '../../../interfaces/IUser';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const AdminMenuUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [rowCount, setRowCount] = useState(0);

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
      console.log('Usuario eliminado:', id);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'surname', headerName: 'Surname', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 130,
    },
    { 
      field: 'createdAt', 
      headerName: 'Date created', 
      width: 200,
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
      width: 100,
      renderCell: (params) => (
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(params.row.id);
          }}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel, refreshKey]);

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked user:', params.row);
  };

  return (
    <AdminTable
      columns={columns}
      rows={users.map(user => ({
        ...user,
        id: user.id.toString(),
      }))}
      title="Users management"
      loading={loading}
      onRowClick={handleRowClick}
      sx={{ paddingBottom: '3.2vw', width: '76vw' }}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rowCount={rowCount}
    />
  );
};

export default AdminMenuUsers;