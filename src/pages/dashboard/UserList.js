import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Button, Tooltip, Container, IconButton, useTheme, Avatar } from '@mui/material';
import { useDeleteUserMutation, useGetUsersQuery } from '../../redux/slices/usersApiSlice';
import { useGetRolesQuery } from '../../redux/slices/roleApiSlice';
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

export default function UserList() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({ page: 'off' });
  const [
    deleteUser,
    { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete },
  ] = useDeleteUserMutation();
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
      dataIndex: 'name',
      title: 'Name',
      tip: 'Name of user',
      align: 'left',
      titleFilter: 'User',
      sortable: true,
      // hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={entity.name} src={entity?.image?.url} sx={{ mr: 2 }} /> {dom}
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      valueType: 'select',
      options: !isLoadingRoles ? roles?.ids.map((id) => ({ label: roles.entities[id].title, value: id })) : 'isLoading',
      render: (dom, entity) => {
        return entity.roles.map((role) => {
          return <span key={role.id}>{`${role.title} `}</span>;
        });
      },
    },
    {
      options: [
        {
          label: 'Active',
          value: 1,
        },
        {
          label: 'Banned',
          value: 0,
        },
      ],
      inTab: true,
      title: 'Status',
      dataIndex: 'active',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'label',
      sortable: true,
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
            {(entity.active === false && 'Banned') || 'Active'}
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
          access: 'delete_user',
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
          access: 'update_user',
          label: (
            <>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </>
          ),
          props: {
            onClick: (entity) => {
              navigate(PATH_DASHBOARD.user.edit(paramCase(entity.id)));
            },
          },
        },
      ],
      render: (dom, entity) => {
        let isSuperAdmin = false;
        for (let i = 0; i < entity.roles.length; i += 1) {
          const role = entity.roles[i];
          isSuperAdmin = role.slug === 'super_admin' || false;
        }
        if (isSuperAdmin) return <></>;
        return dom;
      },
    },
  ];

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    deleteUser({ id });
  };

  const handleDeleteRows = (selected, setSelected) => {
    deleteUser({ ids: selected });
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
            <Access action="create_user_panel">
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.user.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New User
              </Button>
            </Access>
          }
        />
        <ProTable
          requestQuery={useGetUsersQuery}
          columns={columns}
          batchAccesses={['delete_user']}
          BatchOperationActions={BatchOperationActions}
        />
      </Container>
    </Page>
  );
}
