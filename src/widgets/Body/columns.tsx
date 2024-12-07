import { ColumnsType } from 'antd/es/table';
import type { Cell } from 'src/entities/row';
import type { TableRow } from 'src/entities/statement';
import { AmountInput } from 'src/features/table/AmountInput';
import { CellWrapper } from 'src/features/table/CellWrapper';
import { BaseCellWrapper } from 'src/features/table/CellWrapper/CellWrapper';
import { DateInput } from 'src/features/table/DateInput';
import { RenderCurrencyCell } from 'src/features/table/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/table/RenderTextCell';
import { RowAction } from 'src/features/table/RowAction';

export const columns: ColumnsType<TableRow> = [
  {
    dataIndex: 'id',
    key: 'id',
    render: (_id, _row, index) => index + 1,
    title: '#',
  },
  {
    dataIndex: 'date',
    key: 'date',
    render: (cell: Cell<string>, row) => {
      return (
        <BaseCellWrapper row={row}>
          {(row) => <CellWrapper cell={cell} closed={RenderTextCell} open={DateInput} row={row} />}
        </BaseCellWrapper>
      );
    },
    title: 'Date',
  },
  {
    dataIndex: 'outflow',
    key: 'outflow',
    render: (cell: Cell<number>, row) => {
      return (
        <BaseCellWrapper property="outflow" row={row}>
          {(row) => <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />}
        </BaseCellWrapper>
      );
    },
    title: 'Outflow',
  },
  {
    dataIndex: 'inflow',
    key: 'inflow',
    render: (cell: Cell<number>, row) => {
      return (
        <BaseCellWrapper property="inflow" row={row}>
          {(row) => <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />}
        </BaseCellWrapper>
      );
    },
    title: 'Inflow',
  },
  {
    dataIndex: 'amountInBaseCurrency',
    key: 'amountInBaseCurrency',
    render: (cell: Cell<string>, row) => {
      return (
        <BaseCellWrapper property="amount" row={row}>
          {() => <RenderTextCell cell={cell} />}
        </BaseCellWrapper>
      );
    },
    title: 'amount',
  },
  {
    dataIndex: 'memo',
    key: 'memo',
    render: (cell: Cell<string>, row) => {
      return (
        <BaseCellWrapper row={row}>
          {(row) => <CellWrapper cell={cell} closed={RenderTextCell} open={AmountInput} row={row} />}
        </BaseCellWrapper>
      );
    },
    title: 'Memo',
  },
  {
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
    render: (cell: Cell<number>, row) => {
      return <BaseCellWrapper row={row}>{() => <RenderCurrencyCell cell={cell} />}</BaseCellWrapper>;
    },
    title: 'Rate',
  },
  {
    dataIndex: 'amountInTargetCurrency',
    key: 'amountInTargetCurrency',
    render: (cell: Cell<number>, row) => {
      return (
        <BaseCellWrapper property={'amountInTargetCurrency'} row={row}>
          {() => <RenderCurrencyCell cell={cell} />}
        </BaseCellWrapper>
      );
    },
    title: 'Target amount',
  },
  {
    dataIndex: 'action',
    key: 'action',
    render: (_, row) => {
      return <BaseCellWrapper row={row}>{(row) => <RowAction row={row} />}</BaseCellWrapper>;
    },
    title: 'Actions',
  },
];
