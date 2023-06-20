import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Button, Tooltip, Container, IconButton, useTheme } from '@mui/material';
import { useDeleteRoleMutation, useGetRolesQuery } from '../../redux/slices/roleApiSlice';
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

export default function RoleList() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [
    deleteData,
    { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete },
  ] = useDeleteRoleMutation();
  useEffect(() => {
    if (isSuccessDelete) {
      enqueueSnackbar('Delete done.');
    }
    if (isErrorDelete) {
      enqueueSnackbar(errorDelete.data.msg, { variant: 'error' });
    }
  }, [isSuccessDelete, isErrorDelete]);

  const columns = [
    {
      dataIndex: 'title',
      title: 'Title',
      tip: 'Title of role',
      align: 'left',
      titleFilter: 'Title',
      sortable: true,
      // hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: 'Accept Ticket',
      dataIndex: 'acceptTicket',
      valueType: 'select',
      options: [
        {
          value: 1,
          label: 'Yes',
        },
        {
          value: 0,
          label: 'No',
        },
      ],
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(entity.acceptTicket === false && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {(entity.acceptTicket === false && 'No') || 'Yes'}
          </Label>
        );
      },
    },
    {
      title: 'Title in ticket',
      dataIndex: 'titleInTicket',
      valueType: 'textarea',
      hideInSearch: true,
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
          skip: (entity) => entity.slug === 'guest' || entity.slug === 'user',
          access: 'delete_role_panel',
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
          access: 'update_role_panel',
          label: (
            <>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </>
          ),
          props: {
            onClick: (entity) => {
              navigate(PATH_DASHBOARD.role.edit(paramCase(entity.id)));
            },
          },
        },
      ],
      render: (dom, entity) => {
        if (entity.slug === 'super_admin') return <></>;
        return dom;
      },
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
      <Access action="delete_user_panel">
        <Tooltip title="Delete">
          <IconButton color="primary" onClick={() => handleDeleteRows(selected, setSelected)}>
            <Iconify icon={'eva:trash-2-outline'} />
          </IconButton>
        </Tooltip>
      </Access>
    );
  };
  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Access action="create_role_panel">
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.role.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Role
              </Button>
            </Access>
          }
        />
        <ProTable
          requestQuery={useGetRolesQuery}
          columns={columns}
          batchAccesses={['delete_role_panel', 'update_role_panel']}
          BatchOperationActions={BatchOperationActions}
        />
      </Container>
    </Page>
  );
}
