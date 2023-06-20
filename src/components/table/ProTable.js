import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
// import { _userList } from '../../_mock';
// components
import Scrollbar from '../Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions, TableSkeleton } from './index';
import ProTableRow from './ProTableRow';
import ProTableToolbar from './ProTableToolbar';
import Access from '../../guards/Access';

const ProTable = ({ columns, requestQuery, batchAccesses, BatchOperationActions }) => {
  const batchOperation = BatchOperationActions || false;
  const statusFeild = columns.filter((column) => column.inTab === true);
  let STATUS_OPTIONS = [];
  if (statusFeild.length) {
    STATUS_OPTIONS = [{ label: 'all', value: 'all' }, ...statusFeild[0].options];
  }

  const filterItems = columns.filter((column) => !column?.hideInSearch);

  const [params, setParams] = useState({});

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { data, isLoading, isError, isSuccess, error, refetch } = requestQuery({
    page,
    perPage: rowsPerPage,
    ...(orderBy !== '' && { orderBy, order }),
    ...params,
  });

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus, setCurrentTab } = useTabs('all');

  const handleChangeStatusTab = (event, newValue) => {
    if (newValue === 'all') {
      delete params[statusFeild[0].dataIndex];
      setParams(params);
    } else {
      params[statusFeild[0].dataIndex] = newValue;
      setParams((state) => {
        return { ...state, ...params };
        // return { ...params, status: newValue };
      });
    }
    onChangeFilterStatus(event, newValue);
  };

  console.log('error54:', error);
  console.log('isLoading987:', isLoading);
  if (isLoading) return <>Loading...</>;
  const isNotFound = false;
  let tabKey = 0;
  return (
    <Card>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={filterStatus}
        onChange={handleChangeStatusTab}
        sx={{ px: 2, bgcolor: 'background.neutral' }}
      >
        {STATUS_OPTIONS.map((tab) => {
          tabKey += 1;
          return <Tab disableRipple key={`${tab.value}${tabKey}`} label={tab.label} value={tab.value} />;
        })}
      </Tabs>
      <Divider />
      <ProTableToolbar
        filterItems={filterItems}
        doSearch={(filtersValue) => {
          setParams((state) => ({ ...state, ...filtersValue }));
        }}
        cleanFilters={() => {
          setCurrentTab('all');
          setParams({});
        }}
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && batchOperation && (
            <Access action={batchAccesses}>
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={data?.ids.length || 0}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    data.ids.map((id) => id)
                  )
                }
                actions={<BatchOperationActions selected={selected} setSelected={setSelected} />}
              />
            </Access>
          )}
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={columns}
              rowCount={data?.ids.length || 0}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  data.ids.map((id) => id)
                )
              }
              batchAccesses={batchAccesses}
              batchOperation={batchOperation}
            />
            <TableBody>
              {!isLoading ? (
                data?.ids.map((id) => (
                  <ProTableRow
                    key={`${id}${tabKey}`}
                    columns={columns}
                    row={data.entities[id]}
                    selected={selected.includes(id)}
                    onSelectRow={() => onSelectRow(id)}
                    batchAccesses={batchAccesses}
                    batchOperation={batchOperation}
                  />
                ))
              ) : (
                <TableSkeleton columns={columns} />
              )}
              {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(data.nextPage - 1, rowsPerPage, data.totalDocument)}
                  /> */}

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.totalDocument}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={onChangeDense} />}
          label="Dense"
          sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
        />
      </Box>
    </Card>
  );
};

export default ProTable;
