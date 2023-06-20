import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
// components
import { TableMoreMenu } from './index';

// ----------------------------------------------------------------------

ProTableRow.propTypes = {
  columns: PropTypes.array,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  batchAccesses: PropTypes.array,
  batchOperation: PropTypes.func,
};

export default function ProTableRow({ columns, row, selected, onSelectRow, batchAccesses, batchOperation }) {
  const theme = useTheme();
  const { user } = useAuth();

  let flgBatchCheckBox = false;
  for (let i = 0; i < batchAccesses.length; i += 1)
    if (user?.accesses.includes(batchAccesses[i])) flgBatchCheckBox = true;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  let key = 0;
  const actionsColumn = columns.filter((column) => column.valueType === 'action');
  let flgHaveAction = false;
  const _mneuItems = actionsColumn[0]?.menuItems.filter((item) => {
    if (!user?.accesses.includes(item.access)) return false;
    flgHaveAction = true;
    return true;
  });
  const MenuItems = ({ entity }) => {
    const _items = _mneuItems.map((item) => {
      if (item?.skip) if (item?.skip(entity)) return <></>;
      console.log('handle click in pro table actoin:');
      console.log('item:', item);
      console.log('handle click value:', item?.props?.onClick);
      console.log('handle click type:', typeof item?.props?.onClick);
      const handleClick = item?.props?.onClick;
      const props = item?.props;
      delete props?.onClick;
      key += 1;
      return (
        <MenuItem
          key={key}
          onClick={() => {
            handleClick(row);
            handleCloseMenu();
          }}
          {...props}
        >
          {item.label}
        </MenuItem>
      );
    });

    return <>{_items}</>;
  };

  let flgFirstColumn = true;
  return (
    <TableRow hover selected={selected}>
      {batchOperation && flgBatchCheckBox && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      {columns.map((column) => {
        let dom;
        let align = 'left';
        switch (column?.valueType) {
          case 'action':
            align = 'right';
            dom = flgHaveAction ? (
              <>
                <TableMoreMenu
                  open={openMenu}
                  onOpen={handleOpenMenu}
                  onClose={handleCloseMenu}
                  actions={<MenuItems entity={row} />}
                />
              </>
            ) : (
              <></>
            );
            break;
          case 'select':
            if (flgFirstColumn)
              dom = (
                <Typography variant="subtitle2" noWrap>
                  {row[column?.dataIndex]}
                </Typography>
              );
            else dom = <>{row[column?.dataIndex]}</>;
            break;
          case 'label':
            if (flgFirstColumn)
              dom = (
                <Typography variant="subtitle2" noWrap>
                  {row[column?.dataIndex]}
                </Typography>
              );
            else dom = <>{row[column?.dataIndex]}</>;
            break;
          default:
            if (flgFirstColumn)
              dom = (
                <Typography variant="subtitle2" noWrap>
                  {row[column?.dataIndex]}
                </Typography>
              );
            else dom = <>{row[column?.dataIndex]}</>;
        }
        if (column.render) dom = column.render(dom, row);

        flgFirstColumn = false;
        key += 1;
        return (
          <TableCell key={key} align={align}>
            {dom}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
