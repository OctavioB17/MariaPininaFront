import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { enUS } from '@mui/x-data-grid/locales';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useMediaQuery } from '@mui/material';
import { ISxProps } from '../../interfaces/SxProps';
import { AdminTableProps } from '../../interfaces/AdminTableProps';
import { theme } from '../../../config/ThemeConfig';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showMobileDialog, setShowMobileDialog] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const hasSeenDialog = sessionStorage.getItem('hasSeenMobileAdminDialog');
      if (!hasSeenDialog) {
        setShowMobileDialog(true);
        sessionStorage.setItem('hasSeenMobileAdminDialog', 'true');
      }
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setShowMobileDialog(false);
  };

  return (
    <>
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

      <Dialog
        open={showMobileDialog}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDialog-paper': {
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
        <DialogTitle>Mobile experience</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Although you can use the admin panel from your mobile device, 
            we recommend accessing it from a computer for a better user experience. 
            The admin panel is optimized for larger screens.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminTable; 