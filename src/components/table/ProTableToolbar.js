import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
} from '@mui/material';
// components
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

ProTableToolbar.propTypes = {
  filterItems: PropTypes.array,
  doSearch: PropTypes.func,
  batchAccesses: PropTypes.array,
};

export default function ProTableToolbar({ filterItems, doSearch, cleanFilters }) {
  const initStateValues = () => {
    const initFiltersValue = [];
    for (let i = 0; i < filterItems.length; i += 1) {
      const item = filterItems[i];
      initFiltersValue[item.dataIndex] = '';
    }
    return initFiltersValue;
  };

  const [filtersValue, setFiltersValue] = useState(initStateValues());
  const _handleChangeFiltersValue = (value, dataIndex) => {
    const s = [];
    s[dataIndex] = value;
    setFiltersValue((state) => {
      return { ...state, ...s };
    });
  };
  const clearSelects = () => {
    setFiltersValue(initStateValues());
  };

  const onClickSearch = () => {
    let params = {};
    for (let i = 0; i < filterItems.length; i += 1) {
      const item = filterItems[i];
      if (filtersValue[item.dataIndex] !== '') {
        const s = [];
        s[item.dataIndex] = filtersValue[item.dataIndex];
        params = { ...params, ...s };
      }
    }
    doSearch({ ...params });
  };
  return (
    <form onSubmit={(e) => e.preventDefault()} id="create-course-form">
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
        {filterItems.map((item) => {
          if (item.valueType === 'select') {
            if (item.options !== 'isLoading' && item?.options?.length > 0)
              return (
                <FormControl key={item.dataIndex} fullWidth sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id={item.dataIndex}>{item?.titleFilter || item?.title}</InputLabel>
                  <Select
                    id={item.dataIndex}
                    select
                    label={item?.titleFilter || item?.title}
                    value={filtersValue[item.dataIndex]}
                    onChange={(e) => {
                      _handleChangeFiltersValue(e.target.value, item.dataIndex);
                    }}
                    SelectProps={{
                      MenuProps: {
                        sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                      },
                    }}
                    sx={{
                      maxWidth: { sm: 240 },
                      textTransform: 'capitalize',
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {item.options.map((option) => {
                      console.log('item.optionssasas:', item.options);
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
                  </Select>
                </FormControl>
              );
            return <>Loading...</>;
          }
          return (
            <TextField
              key={item.dataIndex}
              fullWidth
              label={item?.titleFilter || item?.title}
              value={filtersValue[item.dataIndex]}
              onChange={(e) => {
                _handleChangeFiltersValue(e.target.value, item.dataIndex);
              }}
              placeholder={`Search ${item?.titleFilter || item?.title}...`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          );
        })}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Search">
            <IconButton color="primary" onClick={() => onClickSearch()} type="submit">
              <Iconify icon={'eva:search-fill'} sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clean">
            <IconButton
              color="primary"
              onClick={() => {
                cleanFilters();
                clearSelects();
                document.getElementById('create-course-form').reset();
              }}
            >
              <Iconify icon={'solar:refresh-bold-duotone'} sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
        </div>
        {/* <Button variant="outlined" onClick={() => onClickSearch()}>
          <Iconify icon={'eva:search-fill'} sx={{ width: 20, height: 20 }} />
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            doSearch({});
            clearSelects();
            document.getElementById('create-course-form').reset();
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ width: 20, height: 20 }} />
        </Button> */}
      </Stack>
    </form>
  );
}
