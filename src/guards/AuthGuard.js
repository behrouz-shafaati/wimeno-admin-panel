import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectCurrentToken } from '../redux/slices/authSlice';
import { useRefreshQuery } from '../redux/slices/authApiSlice';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  const { token } = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const { data, isUninitialized, isLoading, isSuccess, isError, error, refetch } = useRefreshQuery();

  useEffect(() => {
    console.log('isAuthenticated 78:', isAuthenticated);
    if (true) {
      if (!token) refetch();
    }
    return () => {
      effectRan.current = true;
      return effectRan.current;
    };

    // eslint-disable-next-line
  }, []);

  console.log('isLoading:', isLoading);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError || !isAuthenticated) {
    console.log('i am 64');
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }
  if (requestedLocation && pathname !== requestedLocation) {
    console.log('i am 65');
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
