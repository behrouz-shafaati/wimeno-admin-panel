import PropTypes from 'prop-types';
import { useParams, Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Tooltip, Typography, Checkbox } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDateTimeSuffix } from '../../../utils/formatTime';
import createAvatar from '../../../utils/createAvatar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
//
import TicketItemAction from './TicketItemAction';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: { display: 'flex', alignItems: 'center' },
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 },
  },
}));

const WrapStyle = styled(Link)(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  padding: theme.spacing(2, 0),
  transition: theme.transitions.create('padding'),
}));

// ----------------------------------------------------------------------

const linkTo = (params, ticketId) => {
  const { systemLabel, customLabel, departmentId } = params;

  const baseUrl = PATH_DASHBOARD.ticket.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${ticketId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${ticketId}`;
  }
  return `${baseUrl}/${departmentId}/${ticketId}`;
};

TicketItem.propTypes = {
  ticket: PropTypes.object.isRequired,
  isDense: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  onDeselect: PropTypes.func,
  onSelect: PropTypes.func,
};

export default function TicketItem({ ticket, isDense, isSelected, onSelect, onDeselect, ...other }) {
  const params = useParams();

  const { departments } = useSelector((state) => state.ticket);

  const isDesktop = useResponsive('up', 'md');

  const isAttached = false;

  const handleChangeCheckbox = (checked) => (checked ? onSelect() : onDeselect());

  ticket = { ...ticket, isUnread: true };

  return (
    <RootStyle
      sx={{
        ...(!ticket.open && {
          color: 'text.primary',
          backgroundColor: 'background.paper',
        }),
        ...(isSelected && { bgcolor: 'action.selected' }),
        justifyContent: 'space-between',
      }}
      {...other}
    >
      {/* {isDesktop && (
        <Box sx={{ mr: 2, display: 'flex' }}>
          {/* <Checkbox checked={isSelected} onChange={(event) => handleChangeCheckbox(event.target.checked)} /> */}
      {/* <Tooltip title="Starred">
            <Checkbox
              color="warning"
              defaultChecked={ticket.isStarred}
              icon={<Iconify icon={'eva:star-outline'} />}
              checkedIcon={<Iconify icon={'eva:star-fill'} />}
            />
          </Tooltip>
          <Tooltip title="Important">
            <Checkbox
              color="warning"
              defaultChecked={ticket.isImportant}
              checkedIcon={<Iconify icon={'ic:round-label-important'} />}
              icon={<Iconify icon={'ic:round-label-important'} />}
            />
          </Tooltip> *
        </Box>
      )} */}

      <WrapStyle
        color="inherit"
        underline="none"
        component={RouterLink}
        to={linkTo(params, ticket.id)}
        sx={{ ...(isDense && { py: 1 }) }}
      >
        {/* <Avatar
          alt={ticket.user.first_name}
          src={ticket.user.avatar || ''}
          color={createAvatar(ticket.user.first_name).color}
          sx={{ width: 32, height: 32 }}
        >
          {createAvatar(ticket.user.first_name).name}
        </Avatar> */}

        <Box
          sx={{
            ml: 2,
            minWidth: 0,
            alignItems: 'center',
            display: { md: 'flex' },
          }}
        >
          {/* <Typography
            variant="body2"
            noWrap
            sx={{
              pr: 2,
              minWidth: 200,
              ...(!ticket.isUnread && { fontWeight: 'fontWeightBold' }),
            }}
          >
            {`${ticket.user.first_name} ${ticket.user.last_name}`}
          </Typography> */}

          <Typography
            noWrap
            variant="body2"
            sx={{
              pr: 2,
            }}
          >
            <Box component="span" sx={{ ...(!ticket.isUnread && { fontWeight: 'fontWeightBold' }) }}>
              {ticket.subject}
            </Box>
            &nbsp;-&nbsp;
            <Box
              component="span"
              sx={{
                ...(!ticket.isUnread && { color: 'text.secondary' }),
              }}
            >
              {ticket.lastMessageText}
            </Box>
          </Typography>

          {isDesktop && (
            <>
              {/* <Box sx={{ display: 'flex' }}>
                {ticket.labelIds.map((labelId) => {
                  const label = labels.find((_label) => _label.id === labelId);
                  if (!label) return null;
                  return (
                    <Label
                      key={label.id}
                      sx={{
                        mx: 0.5,
                        textTransform: 'capitalize',
                        bgcolor: label.color,
                        color: (theme) => theme.palette.getContrastText(label.color || ''),
                      }}
                    >
                      {label.name}
                    </Label>
                  );
                })}
              </Box> */}

              {isAttached && (
                <Iconify
                  icon={'eva:link-fill'}
                  sx={{
                    mx: 2,
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                  }}
                />
              )}
            </>
          )}

          <Typography
            variant="caption"
            sx={{
              flexShrink: 0,
              minWidth: 120,
              textAlign: 'right',
              ...(!ticket.isUnread && { fontWeight: 'fontWeightBold' }),
            }}
          >
            {/* {fDate(ticket.createdAt)} */}
            {fDateTimeSuffix(ticket.createdAt)}
          </Typography>
        </Box>
      </WrapStyle>
      <Box>
        <Typography
          variant="caption"
          sx={{
            flexShrink: 0,
            minWidth: 120,
            textAlign: 'right',
          }}
        >
          {ticket?.ticketNumber}
        </Typography>
      </Box>

      {/* <TicketItemAction className="showActions" /> */}
    </RootStyle>
  );
}
