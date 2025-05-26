import React from 'react';
import { DataGrid, GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import { enUS } from '@mui/x-data-grid/locales';
import { Box, Typography } from '@mui/material';
import { ISxProps } from '../../interfaces/SxProps';

interface AdminTableProps {
  columns: GridColDef[];
  rows: Record<string, unknown>[];
  title: string;
  loading?: boolean;
  getRowId?: (row: Record<string, unknown>) => string | number;
  onRowClick?: (params: GridRowParams) => void;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  rowCount?: number;
  processRowUpdate?: (newRow: Record<string, unknown>, oldRow: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

const AdminTable: React.FC<AdminTableProps & ISxProps> = ({
  columns,
  rows,
  title,
  loading = false,
  getRowId = (row) => row.id as string | number,
  onRowClick,
  sx,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  processRowUpdate
}) => {
  return (
    <Box sx={{ height: '70vh', padding: '2vw', ...sx }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'left' }}>
        {title}
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        localeText={enUS.components.MuiDataGrid.defaultProps.localeText}
        paginationMode="server"
        processRowUpdate={processRowUpdate}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            cursor: onRowClick ? 'pointer' : 'default',
            backgroundColor: onRowClick ? 'rgba(13, 62, 69, 0.04)' : 'inherit',
          },
          '& .MuiSvgIcon-root': {
            color: 'primary.contrastText',
            '&.Mui-checked': {
              color: 'primary.main',
            },
          },
          '& .MuiPopper-root-MuiDataGrid-panel': {
            color: 'primary.contrastText',
            '&.Mui-checked': {
              color: 'primary.main',
            },
          },
          '& .MuiDataGrid-panel': {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'primary.contrastText',
            '& .MuiDataGrid-filterForm': {
              backgroundColor: 'background.paper',
            },
            '& .MuiInputBase-root': {
              color: 'primary.contrastText',
            },
            '& .MuiInputLabel-root': {
              color: 'primary.contrastText',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
          },
          border: '1px solid',
          borderColor: 'primary.contrastText'
        }}
      />
    </Box>
  );
};

export default AdminTable; 