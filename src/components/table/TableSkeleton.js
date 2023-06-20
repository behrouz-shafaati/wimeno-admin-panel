// @mui
import { TableRow, TableCell, Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableSkeleton({ columns, ...other }) {
  const column = [];
  for (let i = 0; i < columns.length - 2; i += 1)
    column.push(
      <TableCell align="right">
        <Skeleton variant="text" width={100} height={20} />
      </TableCell>
    );

  const rows = [];
  for (let i = 0; i < 5; i += 1)
    rows.push(
      <TableRow {...other}>
        <TableCell align="right" />
        <TableCell align="right">
          <Stack spacing={3} direction="row" alignItems="center">
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width={120} height={20} />
          </Stack>
        </TableCell>
        {column}
        <TableCell align="left">
          <Skeleton variant="text" width={20} height={20} />
        </TableCell>
      </TableRow>
    );

  return rows;
}
