import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 253 253" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_101_2)">
          <path
            d="M52.3426 90.201L65.3006 171.502H66.9726L95.1876 97.307L110.236 101.905L129.464 172.129H131.136L152.872 91.664L169.801 96.262L136.57 197.418L119.641 200.135L89.1266 151.229L69.4806 197.418L48.7896 200.135L9.28855 96.68L52.3426 90.201ZM201.386 200.135L190.727 96.68L235.453 89.783L222.077 198.254L201.386 200.135ZM197.206 73.481C193.444 69.5797 191.563 64.9817 191.563 59.687C191.563 54.3923 193.444 49.864 197.206 46.102C201.107 42.2007 205.705 40.25 211 40.25C216.294 40.25 220.823 42.2007 224.585 46.102C228.486 49.864 230.437 54.3923 230.437 59.687C230.437 64.9817 228.486 69.5797 224.585 73.481C220.823 77.243 216.294 79.124 211 79.124C205.705 79.124 201.107 77.243 197.206 73.481Z"
            fill="#FDA92D"
          />
        </g>
        <defs>
          <clipPath id="clip0_101_2">
            <rect width="253" height="253" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
