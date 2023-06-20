import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem, Button } from '@mui/material';
// اخخن
import useLocales from '../../../../hooks/useLocales';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

ServiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ServiceTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { translate } = useLocales();

  const { sent, serviceNumber, createDate, category, dueDate, status, invoiceTo, totalPrice, invoiceFrom } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={invoiceTo.name} color={createAvatar(invoiceTo.name).color} sx={{ mr: 2 }}>
          {createAvatar(invoiceTo.name).name}
        </Avatar>

        <Stack>
          <Typography variant="subtitle2" noWrap>
            {invoiceTo.name}
          </Typography>

          <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {serviceNumber}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{invoiceFrom.description}</TableCell>

      <TableCell align="left">{category}</TableCell>

      <TableCell align="center">{fDate(dueDate)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === 'active' && 'success') ||
            (status === 'suspended' && 'warning') ||
            (status === 'deactive' && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <Button size="small" startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}>
          {translate('service.renewal')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
