import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { Box } from '@mui/material'
import AdminMenuList from './AdminMenuList'
import { useParams } from 'react-router-dom'
import AdminMenuUsers from './AdminMenuUsers'
import AdminMenuProducts from './adminMenuProducts'
import AdminMenuCategories from './AdminMenuCategories'
import AdminMenuOrders from './AdminMenuOrders'

const AdminMenu = () => {

  const { '*': path } = useParams()

  const getComponentByPath = () => {
    switch(path) {
      case 'users':
        return <AdminMenuUsers />;
      case 'products':
        return <AdminMenuProducts />;
      case 'categories':
        return <AdminMenuCategories />;
      case 'orders':
        return <AdminMenuOrders />;
      default:
        return <AdminMenuUsers />;
    }
  }
    
  return (
    <NBoxWithHeaderAndFooter sx={{width: '94vw'}}>
        <Box sx={{display: 'flex', gap: 2, borderRight: '1px solid #0d3e45', paddingTop: '2vw', paddingBottom: '2vw'}}>
            <AdminMenuList sx={{width: '10vw'}}/>
            {getComponentByPath()}
        </Box>
    </NBoxWithHeaderAndFooter>
)
}

export default AdminMenu