import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectUser } from '../../store/userSlice';


const UserProtectedRoute: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const user = useAppSelector(selectUser);

  if (!user || user.id !== userId) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;