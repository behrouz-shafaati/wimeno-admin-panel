import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { SeoIllustration } from '../../../../assets';
import useLocales from '../../../../hooks/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

WelcomeApp.propTypes = {
  displayName: PropTypes.string,
};

export default function WelcomeApp({ displayName }) {
  const { translate } = useLocales();
  const onclick = () => {
    window.location = 'https://wimeno.com';
  };
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
          {translate('panel.welcomeBack')}
          <br /> {!displayName ? '...' : displayName} !
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          {translate('panel.thisIsCustomersPanel')}
        </Typography>

        <Button variant="contained" onClick={() => onclick()}>
          {translate('panel.exploreWebsite')}
        </Button>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' },
        }}
      />
    </RootStyle>
  );
}
