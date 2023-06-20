import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Card } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
// import { getDepartments } from '../../redux/slices/ticket';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TicketList, TicketDetails, TicketSidebar, TicketCompose } from '../../sections/@dashboard/ticket';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function Ticket() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { ticketId } = useParams();

  const [openSidebar, setOpenSidebar] = useState(false);
  console.log('ticketId: 43', ticketId);
  useEffect(() => {
    // dispatch(getDepartments());
  }, [dispatch]);

  return (
    <Page title={translate('ticket.title')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={translate('ticket.title')}
          links={[
            {
              name: translate('dashboard.title'),
              href: PATH_DASHBOARD.root,
            },
            { name: translate('ticket.title') },
          ]}
        />
        <Card sx={{ height: { md: '72vh' }, display: { md: 'flex' } }}>
          <TicketSidebar isOpenSidebar={openSidebar} onCloseSidebar={() => setOpenSidebar(false)} />
          {ticketId ? <TicketDetails /> : <TicketList onOpenSidebar={() => setOpenSidebar(true)} />}
        </Card>
      </Container>
    </Page>
  );
}
