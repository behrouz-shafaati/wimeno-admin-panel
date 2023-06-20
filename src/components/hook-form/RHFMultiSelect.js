import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { MenuItem, Box, Chip, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFMultiSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFMultiSelect({ name, label, options, children, ...other }) {
  const { control } = useFormContext();
  const renderValue = (selected) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => {
          const selectedOption = options.filter((option) => option.value === value);
          return <Chip key={value} label={selectedOption[0].label} />;
        })}
      </Box>
    );
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          label={label}
          {...field}
          fullWidth
          select
          SelectProps={{ native: false, multiple: true, renderValue }}
          error={!!error}
          helperText={error?.message}
          // renderValue={renderValue}
          {...other}
        >
          {options.map((option) => {
            return (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </TextField>
      )}
    />
  );
}
