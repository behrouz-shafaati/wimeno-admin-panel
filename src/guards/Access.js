import React from 'react';
import useAuth from '../hooks/useAuth';

const Access = ({ action, children }) => {
  const { user } = useAuth();
  if (typeof action === 'string' && user?.accesses.includes(action)) return children;
  for (let i = 0; i < action.length; i += 1) if (user?.accesses.includes(action[i])) return children;
  return <></>;
};

export default Access;
