import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Tooltip, Checkbox, Typography, IconButton, InputAdornment, TablePagination } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
}));

// ----------------------------------------------------------------------

TicketToolbar.propTypes = {
  tickets: PropTypes.number.isRequired,
  selectedTickets: PropTypes.number.isRequired,
  onOpenSidebar: PropTypes.func,
  onToggleDense: PropTypes.func,
  onSelectAll: PropTypes.func,
  onDeselectAll: PropTypes.func,
};

export default function TicketToolbar({
  tickets,
  selectedTickets,
  onOpenSidebar,
  onToggleDense,
  onSelectAll,
  onDeselectAll,
  refresh,
  page,
  count,
  rowsPerPage,
  onChangePage,
  setSearchParams,
  ...other
}) {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const [search, setSearch] = useState('');

  const handleSelectChange = (checked) => (checked ? onSelectAll() : onDeselectAll());
  const selectedAllTickets = selectedTickets === tickets && tickets > 0;
  const selectedSomeTickets = selectedTickets > 0 && selectedTickets < tickets;

  const activeNextButton = !((page + 1) * rowsPerPage >= count);
  const activePreviousButton = page > 0;
  const fromDocument = page * rowsPerPage;
  const toDocument = (page + 1) * rowsPerPage < count ? (page + 1) * rowsPerPage : count;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== '') {
        setSearchParams((params) => {
          return { ...params, subject: search };
        });
      } else {
        setSearchParams((params) => {
          delete params?.subject;
          return params;
        });
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <RootStyle {...other}>
      {!mdUp && (
        <IconButton onClick={onOpenSidebar}>
          <Iconify icon={'eva:menu-fill'} />
        </IconButton>
      )}

      {smUp && (
        <>
          {/* <Checkbox
            checked={selectedAllTickets}
            indeterminate={selectedSomeTickets}
            onChange={(event) => handleSelectChange(event.target.checked)}
          /> */}
          <Tooltip title="Refresh">
            <IconButton onClick={() => refresh()}>
              <Iconify icon={'eva:refresh-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dense">
            <IconButton onClick={onToggleDense}>
              <Iconify icon={'eva:collapse-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="More">
            <IconButton>
              <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip> */}
        </>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <InputStyle
        stretchStart={180}
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search ticket…"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
      />
      {/* {smUp && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            {fromDocument} - {toDocument} of {count}
          </Typography>
          <Tooltip title="Previous page">
            <IconButton onClick={(e) => onChangePage(e, page - 1)} disabled={!activePreviousButton}>
              <Iconify icon={'eva:arrow-ios-forward-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next page">
            <IconButton onClick={(e) => onChangePage(e, page + 1)} disabled={!activeNextButton}>
              <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )} */}
    </RootStyle>
  );
}
