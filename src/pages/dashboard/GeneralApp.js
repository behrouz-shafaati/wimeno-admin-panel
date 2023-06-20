// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
// import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { WelcomeApp } from '../../sections/@dashboard/general/app';
import AppCurrentServices from '../../sections/@dashboard/general/app/AppCurrentServices';
import AppCurrentTickets from '../../sections/@dashboard/general/app/AppCurrentTickets';
import AppCurrentInvoices from '../../sections/@dashboard/general/app/AppCurrentInvoices';
import FrequentlyQuestions from '../../sections/@dashboard/general/app/FrequentlyQuestions';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  // const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <WelcomeApp displayName={'Behrouz shafaati'} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentServices />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentTickets />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentInvoices />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <FrequentlyQuestions />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
