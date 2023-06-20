import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useGetRolesQuery } from '../../redux/slices/roleApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import RoleNewEditForm from '../../sections/@dashboard/role/RoleNewEditForm';

// ----------------------------------------------------------------------

export default function RoleCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const { data, isLoading, isError, isSuccess, error } = useGetRolesQuery({ id }, { skip: id === '' });
  let currentData = null;
  if (isSuccess) currentData = data.entities[id];
  let titleName;
  if (!isEdit) titleName = 'New Role';
  else if (isLoading) titleName = `loading...`;
  else if (!currentData) titleName = 'Not Found';
  else titleName = currentData.title;
  return (
    <Page title="Role: Create a new role">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new role' : 'Edit role'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Role', href: PATH_DASHBOARD.role.list },
            { name: titleName },
          ]}
        />

        {!isLoading ? <RoleNewEditForm isEdit={isEdit} currentData={currentData} /> : <>sceleton</>}
      </Container>
    </Page>
  );
}
