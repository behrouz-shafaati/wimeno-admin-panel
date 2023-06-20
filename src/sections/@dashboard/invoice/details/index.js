import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// hook
import useLocales from '../../../../hooks/useLocales';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice }) {
  const theme = useTheme();
  const { translate } = useLocales();

  if (!invoice) {
    return null;
  }

  const {
    items,
    taxes,
    status,
    dueDate,
    discount,
    invoiceTo,
    createDate,
    totalPrice,
    invoiceFrom,
    invoiceNumber,
    subTotalPrice,
  } = invoice;

  return (
    <>
      <InvoiceToolbar invoice={invoice} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/logo_full.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'paid' && 'success') ||
                  (status === 'unpaid' && 'warning') ||
                  (status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>

              <Typography variant="h6">{invoiceNumber}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {translate('invoice.from')}
            </Typography>
            <Typography variant="body2">{invoiceFrom.name}</Typography>
            <Typography variant="body2">{invoiceFrom.address}</Typography>
            <Typography variant="body2">
              {translate('invoice.phone')}: {invoiceFrom.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {translate('invoice.to')}
            </Typography>
            <Typography variant="body2">{invoiceTo.name}</Typography>
            <Typography variant="body2">{invoiceTo.address}</Typography>
            <Typography variant="body2">
              {translate('invoice.phone')}: {invoiceTo.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {translate('invoice.created')}
            </Typography>
            <Typography variant="body2">{fDate(createDate)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {translate('invoice.due')}
            </Typography>
            <Typography variant="body2">{fDate(dueDate)}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">{translate('invoice.description')}</TableCell>
                  <TableCell align="left">{translate('invoice.qty')}</TableCell>
                  <TableCell align="right">{translate('invoice.unitPrice')}</TableCell>
                  <TableCell align="right">{translate('invoice.total')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                  </TableRow>
                ))}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>{translate('invoice.subtotal')}</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{fCurrency(subTotalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>{translate('invoice.discount')}</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography sx={{ color: 'error.main' }}>{discount && fCurrency(-discount)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>{translate('invoice.taxes')}</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography>{taxes && fCurrency(taxes)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">{translate('invoice.total')}</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(totalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">{translate('invoice.note1')}</Typography>
            <Typography variant="body2">{translate('invoice.note1Des')}</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">{translate('invoice.contactUs')}</Typography>
            <Typography variant="body2">support@wimeno.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
