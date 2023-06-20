import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// utils
import { fDateTimeSuffix } from '../../../utils/formatTime';
// components
import Image from '../../../components/Image';
import { TicketDetailsAttachments } from '.';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

TicketMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
  isTicketOpener: PropTypes.bool,
};

export default function TicketMessageItem({ isTicketOpener, message, conversation, onOpenLightbox }) {
  const sender = message.user;
  const isAttached = message.attachments.length > 0;
  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isTicketOpener && {
            ml: 'auto',
          }),
        }}
      >
        {!isTicketOpener && <Avatar alt={sender.name} src={sender?.image?.url} sx={{ width: 32, height: 32, mr: 2 }} />}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <InfoStyle
              variant="caption"
              sx={{
                ...(isTicketOpener && { justifyContent: 'flex-end' }),
              }}
            >
              {!isTicketOpener && `${sender?.name},`}&nbsp;
              {fDateTimeSuffix(message.createdAt)}
            </InfoStyle>

            <ContentStyle
              sx={{
                ...(isTicketOpener && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              }}
            >
              <Typography variant="body2">
                <div dangerouslySetInnerHTML={{ __html: message?.message }} />
              </Typography>
            </ContentStyle>
          </div>
          {isAttached && <TicketDetailsAttachments ticket={message} onOpenLightbox={onOpenLightbox} />}
        </div>
      </Box>
    </RootStyle>
  );
}
