import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

TableHeadCustom.propTypes = {
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  sx: PropTypes.object,
  batchAccesses: PropTypes.array,
  batchOperation: PropTypes.func,
};

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  batchAccesses,
  batchOperation,
}) {
  const { user } = useAuth();

  let flgBatchCheckBox = false;
  for (let i = 0; i < batchAccesses.length; i += 1)
    if (user?.accesses.includes(batchAccesses[i])) flgBatchCheckBox = true;

  let key = 0;
  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && batchOperation && flgBatchCheckBox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => {
          key += 1;
          return (
            <TableCell
              key={`${headCell.dataIndex}${key}`}
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.dataIndex ? order : false}
              sx={{ width: headCell.width, minWidth: headCell.minWidth }}
            >
              {onSort && headCell.sortable ? (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.dataIndex}
                  direction={orderBy === headCell.dataIndex ? order : 'asc'}
                  onClick={() => onSort(headCell.dataIndex)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {headCell.title}

                  {orderBy === headCell.dataIndex ? (
                    <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.title
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
