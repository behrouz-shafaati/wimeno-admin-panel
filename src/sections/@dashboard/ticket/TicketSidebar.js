import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, List, Drawer, Button, Divider } from '@mui/material';
// redux
import { dispatch, useSelector } from '../../../redux/store';
import { useGetRolesQuery } from '../../../redux/slices/roleApiSlice';
import { switchShowCompose } from '../../../redux/slices/ticket';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAVBAR } from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { SkeletonTicketSidebarItem } from '../../../components/skeleton';
//
import TicketSidebarItem from './TicketSidebarItem';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

TicketSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function TicketSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { translate } = useLocales();

  const { pathname } = useLocation();

  const { data: _departments, isLoading: isLoadingDepartment } = useGetRolesQuery({ page: 'off' });
  const departmentIds = _departments?.ids.filter(
    (id) => _departments.entities[id].acceptTicket === true && _departments.entities[id].slug !== 'super_admin'
  );
  const isDesktop = useResponsive('up', 'md');

  // const loading = !departments.length;

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenCompose = () => {
    onCloseSidebar();
    dispatch(switchShowCompose());
  };

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
          onClick={handleOpenCompose}
        >
          {translate('ticket.create')}
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {(isLoadingDepartment ? [...Array(8)] : departmentIds).map((id, index) =>
          id ? (
            <TicketSidebarItem key={id} department={_departments.entities[id]} />
          ) : (
            <SkeletonTicketSidebarItem key={index} />
          )
        )}
      </List>
    </Scrollbar>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer variant="permanent" PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH, position: 'relative' } }}>
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
