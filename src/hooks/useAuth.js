import { useContext } from 'react';
import { useSelector } from 'react-redux';
//
import { AuthContext } from '../contexts/JWTContext';
// import { AuthContext } from '../contexts/Auth0Context';
// import { AuthContext } from '../contexts/FirebaseContext';
// import { AuthContext } from '../contexts/AwsCognitoContext';

import { selectCurrentToken } from '../redux/slices/authSlice';
// ----------------------------------------------------------------------

const useAuth = () => {
  // const context = useContext(AuthContext);

  // if (!context) throw new Error('Auth context must be use inside AuthProvider');

  // return context;

  const { token, user } = useSelector(selectCurrentToken);
  let isAuthenticated = false;
  let isInitialized = false;
  const method = 'jwt';
  if (token) {
    isAuthenticated = true;
    isInitialized = true;

    return { user, isAuthenticated, isInitialized, method };
  }

  return { user: null, isAuthenticated, isInitialized, method };
};

export default useAuth;
