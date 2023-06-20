import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useGetUsersQuery } from '../../redux/slices/usersApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const { data, isLoading, isError, isSuccess, error } = useGetUsersQuery({ id }, { skip: id === '' });
  let currentUser = null;
  if (isSuccess) currentUser = data.entities[id];
  let titleName;
  if (!isEdit) titleName = 'New User';
  else if (isLoading) titleName = `loading...`;
  else if (!currentUser) titleName = 'Not Found';
  else titleName = currentUser.name;
  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: titleName },
          ]}
        />

        {!isLoading ? <UserNewEditForm isEdit={isEdit} currentUser={currentUser} /> : <>sceleton</>}
      </Container>
    </Page>
  );
}
