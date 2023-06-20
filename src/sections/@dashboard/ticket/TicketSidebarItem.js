import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Typography, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const LABEL_ICONS = {
  all: 'eva:eticket-fill',
  inbox: 'eva:inbox-fill',
  trash: 'eva:trash-2-outline',
  drafts: 'eva:file-fill',
  spam: 'ic:round-report',
  sent: 'ic:round-send',
  starred: 'eva:star-fill',
  important: 'ic:round-label-important',
  id_social: 'eva:share-fill',
  id_promotions: 'ic:round-label',
  id_forums: 'ic:round-forum',
};

const linkTo = (department) => {
  const baseUrl = PATH_DASHBOARD.ticket.root;

  if (department.type === 'system') {
    return `${baseUrl}/${department.id}`;
  }
  if (department.type === 'custom') {
    return `${baseUrl}/department/${department.title}`;
  }

  return `${baseUrl}/${department.id}`;
};

// ----------------------------------------------------------------------

TicketSidebarItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default function TicketSidebarItem({ department, ...other }) {
  const isUnread = department.unread > 0;

  return (
    <ListItemButton
      to={linkTo(department)}
      component={RouterLink}
      sx={{
        px: 3,
        height: 48,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        '&.active': {
          color: 'text.primary',
          fontWeight: 'fontWeightMedium',
          bgcolor: 'action.selected',
        },
      }}
      {...other}
    >
      <ListItemIcon>
        <Iconify icon={LABEL_ICONS[department.id]} style={{ color: department.color }} width={24} height={24} />
      </ListItemIcon>

      <ListItemText disableTypography primary={department.title} />

      {isUnread && <Typography variant="caption">{department.unread}</Typography>}
    </ListItemButton>
  );
}
