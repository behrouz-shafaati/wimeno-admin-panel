import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock/_invoice';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();
  const {translate} = useLocales()

  const { id } = useParams();

  const invoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title={translate('invoice.invoiceDetails')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('invoice.invoiceDetails')}
          links={[
            { name: translate('dashboard.title'), href: PATH_DASHBOARD.root },
            {
              name: translate('invoice.title'),
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: invoice?.invoiceNumber || '' },
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  );
}
