import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Button, Tooltip, Container, IconButton, useTheme, Avatar } from '@mui/material';
import { useDeleteCategoryMutation, useGetCategorysQuery } from '../../redux/slices/categoryApiSlice';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Access from '../../guards/Access';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Label from '../../components/Label';
import ProTable from '../../components/table/ProTable';

// ----------------------------------------------------------------------

export default function CategoryList() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategorysQuery({
    page: 'off',
  });

  const [
    deleteData,
    { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete },
  ] = useDeleteCategoryMutation();
  const [parentCategories, setParentCategories] = useState([]);
  useEffect(() => {
    if (isSuccessDelete) {
      enqueueSnackbar('Delete done.');
    }
    if (isErrorDelete) {
      enqueueSnackbar(errorDelete.data.msg, { variant: 'error' });
    }
  }, [isSuccessDelete, isErrorDelete]);

  useEffect(() => {
    const parentsId = categories?.ids.filter((id) => categories.entities[id].parent === null);
    setParentCategories(parentsId);
  }, [categories]);

  const columns = [
    {
      dataIndex: 'title',
      title: 'Title',
      tip: 'Title of category',
      align: 'left',
      titleFilter: 'Title',
      sortable: true,
      // hideInSearch: true,
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={entity.title} src={entity?.avatar?.url} sx={{ mr: 2 }} /> {dom}
          </div>
        );
      },
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentId',
      valueType: 'select',
      options: !isLoadingCategories
        ? parentCategories?.map((id) => ({ label: categories.entities[id].title, value: id }))
        : 'isLoading',
      render: (dom, entity) => {
        return entity?.parent?.title || '-';
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      inTab: true,
      title: 'Status',
      dataIndex: 'active',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'label',
      options: [
        {
          label: 'Active',
          value: '1',
        },
        {
          label: 'Deactive',
          value: '0',
        },
      ],
      // set key name in searh parameter
      search: {
        transform: (val) => {
          return { active: val };
        },
      },
      render: (dom, entity) => {
        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(entity.active === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {(entity.active === false && 'Deactive') || 'Active'}
          </Label>
        );
      },
    },
    {
      title: '',
      dataIndex: 'actions',
      valueType: 'action',
      hideInSearch: true,
      menuItems: [
        {
          access: 'delete_categorys',
          label: (
            <>
              <Iconify icon={'eva:trash-2-outline'} />
              Delete
            </>
          ),
          props: {
            onClick: (entity) => {
              handleDeleteRow(entity.id);
            },
            sx: { color: 'error.main' },
          },
        },
        {
          access: 'update_category',
          label: (
            <>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </>
          ),
          props: {
            onClick: (entity) => {
              navigate(PATH_DASHBOARD.category.edit(paramCase(entity.id)));
            },
          },
        },
      ],
    },
  ];

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    deleteData({ id });
  };

  const handleDeleteRows = (selected, setSelected) => {
    deleteData({ ids: selected });
    setSelected([]);
  };

  const BatchOperationActions = ({ selected, setSelected }) => {
    return (
      <Access action="delete_categorys">
        <Tooltip title="Delete">
          <IconButton color="primary" onClick={() => handleDeleteRows(selected, setSelected)}>
            <Iconify icon={'eva:trash-2-outline'} />
          </IconButton>
        </Tooltip>
      </Access>
    );
  };
  return (
    <Page title="Category: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Category List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Category', href: PATH_DASHBOARD.category.root },
            { name: 'List' },
          ]}
          action={
            <Access action="add_category">
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.category.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Category
              </Button>
            </Access>
          }
        />
        <ProTable
          requestQuery={useGetCategorysQuery}
          columns={columns}
          batchAccesses={['delete_categorys', 'update_category']}
          BatchOperationActions={BatchOperationActions}
        />
      </Container>
    </Page>
  );
}
