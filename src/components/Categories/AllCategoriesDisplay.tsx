import { useEffect, useState } from 'react'
import ICategory from '../../interfaces/ICategories'
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import { Box, Typography, Pagination, CircularProgress } from '@mui/material'
import axios from 'axios'
import { variables } from '../../config/variables'
import IPaginationResponse from '../interfaces/IPaginationResponse'
import CategoryCard from './CategoryCard'

const AllCategoriesDisplay = () => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const categoriesPerPage = 10

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const offset = (page - 1) * categoriesPerPage
                const response = await axios.get<IPaginationResponse<ICategory>>(
                    `${variables.backendIp}/categories/get/all?limit=${categoriesPerPage}&offset=${offset}`
                )
                setCategories(response.data.data)
                if (response.data.data.length < categoriesPerPage) {
                    setTotalPages(page)
                } else {
                    setTotalPages(page + 1)
                }
            } catch {
                setCategories([])
                setTotalPages(1)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [page])

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    return (
        <NBoxWithHeaderAndFooter>
            <Box sx={{ paddingTop: '1vw', paddingBottom: '2vw', gap: '1vw', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{display: 'flex', paddingTop: '1vw', paddingBottom: '1vw', flexDirection: 'column', gap: '1vw', textAlign: 'left'}}>
                    <Typography variant='h4' sx={{position: 'relative', left: '4.5%'}}>Categories</Typography>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1vw', alignItems: 'center', justifyContent: 'center'}}>
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2vw' }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    </>
                )}
            </Box>
        </NBoxWithHeaderAndFooter>
    ) 
}

export default AllCategoriesDisplay