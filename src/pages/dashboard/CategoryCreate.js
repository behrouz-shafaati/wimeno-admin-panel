import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useGetCategorysQuery } from '../../redux/slices/categoryApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CategoryNewEditForm from '../../sections/@dashboard/category/CategoryNewEditForm';

// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const { data, isLoading, isError, isSuccess, error } = useGetCategorysQuery({ id }, { skip: id === '' });
  let currentData = null;
  if (isSuccess) currentData = data.entities[id];
  let titleName;

  if (!isEdit) titleName = 'New Category';
  else if (isLoading) titleName = `loading...`;
  else if (!currentData) titleName = 'Not Found';
  else titleName = currentData.title;

  return (
    <Page title="Category: Create a new category">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new category' : 'Edit category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Catrgoty', href: PATH_DASHBOARD.category.list },
            { name: titleName },
          ]}
        />

        {!isLoading ? <CategoryNewEditForm isEdit={isEdit} currentCategory={currentData} /> : <>sceleton</>}
      </Container>
    </Page>
  );
}
