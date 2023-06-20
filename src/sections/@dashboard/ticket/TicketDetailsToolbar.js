import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Tooltip, Typography, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// rudex
import { useUpdateTicketMutation } from '../../../redux/slices/ticketApiSlice';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import createAvatar from '../../../utils/createAvatar';
import { fDateTimeSuffix } from '../../../utils/formatTime';
// components
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  justifyContent: 'space-between',
}));

// ----------------------------------------------------------------------

TicketDetailsToolbar.propTypes = {
  ticket: PropTypes.object,
};

export default function TicketDetailsToolbar({ ticket, ...other }) {
  const navigate = useNavigate();
  const { systemLabel, customLabel, departmentId } = useParams();

  const isDesktop = useResponsive('up', 'sm');

  const baseUrl = PATH_DASHBOARD.ticket.root;
  const [updateTicket, { isLoading, isError, error }] = useUpdateTicketMutation();
  const handleBack = () => {
    if (systemLabel) {
      return navigate(`${baseUrl}/${systemLabel}`);
    }
    if (customLabel) {
      return navigate(`${baseUrl}/label/${customLabel}`);
    }
    if (departmentId) return navigate(`${baseUrl}/${departmentId}`);
    return navigate(`${baseUrl}/index`);
  };
  return (
    <RootStyle {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Back">
          <IconButton onClick={handleBack}>
            <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
          </IconButton>
        </Tooltip>
        {/* from */}
        <Avatar alt={ticket?.user.name} src={ticket.user.avatar || ''} color={createAvatar(ticket.user.name).color}>
          {createAvatar(ticket.user.name).name}
        </Avatar>

        <Box sx={{ ml: 2 }}>
          <Typography display="inline" variant="subtitle2">
            {ticket.user.name}
          </Typography>
          <Link variant="caption" sx={{ color: 'text.secondary' }}>
            &nbsp; {`${ticket.subject}`}
          </Link>
          {/* <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Status:&nbsp;
            <Link color="inherit" key={ticket.user.id}>
              {/* {ticket.status.label} 
            </Link>
          </Typography> */}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isDesktop && (
          <>
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 2 }}>
              {fDateTimeSuffix(ticket.createdAt)}
            </Typography>
            {/* <Tooltip title="Reply">
              <IconButton>
                <Iconify icon={'ic:round-reply'} width={20} height={20} />
              </IconButton>
            </Tooltip> */}
          </>
        )}

        {ticket.open && (
          <LoadingButton
            onClick={() => {
              updateTicket({ ticketId: ticket.id, open: false });
            }}
            loading={isLoading}
          >
            Close Ticket
          </LoadingButton>
        )}
        {/* <Tooltip title="More options">
          <IconButton>
            <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
          </IconButton>
        </Tooltip> */}
      </Box>
    </RootStyle>
  );
}
