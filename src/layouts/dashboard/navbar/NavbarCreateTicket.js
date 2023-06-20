import PropTypes from 'prop-types';
// @mui
import { Stack, Button, Typography } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
// redux
import { dispatch } from '../../../redux/store';
import { switchShowCompose } from '../../../redux/slices/ticket';
// assets
import { DocIllustration } from '../../../assets';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function NavbarCreateTicket() {
  const {translate} = useLocales()
  const { user } = useAuth()
  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          {translate('hi')}! {user.firt_name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {translate('needHelp')}
          <br /> {translate('plzSendTicket')}
        </Typography>
      </div>

      <Button variant="contained" onClick={() => dispatch(switchShowCompose())}>{translate('ticket.create')}</Button>
    </Stack>
  );
}
