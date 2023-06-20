import { useEffect } from 'react';
import { store } from '../../redux/store';
import { usersApiSlice } from '../../redux/slices/usersApiSlice';
import { roleApiSlice } from '../../redux/slices/roleApiSlice';
import { ticketApiSlice } from '../../redux/slices/ticketApiSlice';
import { categoryApiSlice } from '../../redux/slices/categoryApiSlice';

const Prefech = ({ children }) => {
  useEffect(() => {
    store.dispatch(
      usersApiSlice.util.prefetch('getUsers', { page: 0, perPage: 5, orderBy: 'name', order: 'asc' }, { force: true })
    );
    store.dispatch(usersApiSlice.util.prefetch('getUsers', { page: 0, perPage: 5 }, { force: true }));
    store.dispatch(roleApiSlice.util.prefetch('getRoles', { page: 'off' }, { force: true }));
    store.dispatch(roleApiSlice.util.prefetch('getRoles', { page: 0, perPage: 5 }, { force: true }));
    store.dispatch(categoryApiSlice.util.prefetch('getCategorys', { page: 0, perPage: 5 }, { force: true }));
    store.dispatch(categoryApiSlice.util.prefetch('getCategorys', { page: 'off' }, { force: true }));
  }, []);

  return children;
};

export default Prefech;
