import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Divider, Box } from '@mui/material';
// hook
import useLocales from '../../../hooks/useLocales';
import useTicket from '../../../hooks/useTicket';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { useGetTicketsQuery } from '../../../redux/slices/ticketApiSlice';
// components
import LoadingLogo from '../../../components/LoadingLogo';
import Scrollbar from '../../../components/Scrollbar';
import EmptyContent from '../../../components/EmptyContent';
import TicketItem from './TicketItem';
import TicketToolbar from './TicketToolbar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
});

// ----------------------------------------------------------------------

TicketList.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function TicketList({ onOpenSidebar }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
    setDense,
  } = useTicket({ defaultRowsPerPage: 5 });

  const params = useParams();
  const [searchParams, setSearchParams] = useState(params);

  const { translate } = useLocales();

  const {
    data: tickets,
    isLoading,
    refetch: refetchTickets,
  } = useGetTicketsQuery({ ...searchParams, page, perPage: rowsPerPage });

  const [selectedTickets, setSelectedTickets] = useState([]);

  // const isEmpty = tickets.allIds.length < 1;

  useEffect(() => {
    setSearchParams(params);
  }, [params]);

  const handleSelectAllTickets = () => {
    // setSelectedTickets(tickets.allIds.map((ticketId) => ticketId));
  };

  const handleToggleDense = () => {
    setDense((prev) => !prev);
  };

  const handleDeselectAllTickets = () => {
    setSelectedTickets([]);
  };

  const handleSelectOneTicket = (ticketId) => {
    setSelectedTickets((prevSelectedTickets) => {
      if (!prevSelectedTickets.includes(ticketId)) {
        return [...prevSelectedTickets, ticketId];
      }
      return prevSelectedTickets;
    });
  };

  const handleDeselectOneTicket = (ticketId) => {
    setSelectedTickets((prevSelectedTickets) => prevSelectedTickets.filter((id) => id !== ticketId));
  };

  if (isLoading) {
    return <LoadingLogo />;
  }
  const isEmpty = !tickets?.ids.length;
  return (
    <RootStyle>
      <TicketToolbar
        tickets={tickets?.ids.length}
        selectedTickets={selectedTickets.length}
        onSelectAll={handleSelectAllTickets}
        onOpenSidebar={onOpenSidebar}
        onDeselectAll={handleDeselectAllTickets}
        onToggleDense={handleToggleDense}
        refresh={() => refetchTickets()}
        page={page}
        count={tickets?.totalDocument}
        rowsPerPage={rowsPerPage}
        onChangePage={onChangePage}
        setSearchParams={setSearchParams}
      />

      <Divider />
      {!isEmpty ? (
        <Scrollbar>
          <Box sx={{ minWidth: { md: 800 } }}>
            {tickets.ids.map((ticketId) => (
              <TicketItem
                key={ticketId}
                isDense={dense}
                ticket={tickets.entities[ticketId]}
                isSelected={selectedTickets.includes(ticketId)}
                onSelect={() => handleSelectOneTicket(ticketId)}
                onDeselect={() => handleDeselectOneTicket(ticketId)}
              />
            ))}
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent
          title={translate('ticket.empty')}
          img="https://minimals.cc/assets/illustrations/illustration_empty_mail.svg"
          sx={{ flexGrow: 1, height: 'auto' }}
        />
      )}
    </RootStyle>
  );
}
