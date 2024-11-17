import { ColumnsType } from 'antd/es/table';
import type { Cell, Row } from 'src/entities/row';
import { AmountInput } from 'src/features/table/AmountInput';
import { CellWrapper } from 'src/features/table/CellWrapper';
import { DateInput } from 'src/features/table/DateInput';
import { RenderCurrencyCell } from 'src/features/table/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/table/RenderTextCell';
import { RowAction } from 'src/features/table/RowAction';

export const columns: ColumnsType<Row> = [
  {
    dataIndex: 'id',
    key: 'id',
    render: (_id, _row, index) => index + 1,
    title: '#',
  },
  {
    dataIndex: 'date',
    key: 'date',
    render: (cell: Cell<string>, row: Row) => {
      return <CellWrapper cell={cell} closed={RenderTextCell} open={DateInput} row={row} />;
    },
    title: 'Date',
  },
  {
    dataIndex: 'outflow',
    key: 'outflow',
    render: (cell: Cell<number>, row: Row) => {
      return <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />;
    },
    title: 'Outflow',
  },
  {
    dataIndex: 'inflow',
    key: 'inflow',
    render: (cell: Cell<number>, row: Row) => {
      return <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />;
    },
    title: 'Inflow',
  },
  {
    dataIndex: 'amountInBaseCurrency',
    key: 'amountInBaseCurrency',
    render: (cell: Cell<string>) => {
      return <RenderTextCell cell={cell} />;
    },
    title: 'amount',
  },
  {
    dataIndex: 'memo',
    key: 'memo',
    render: (cell: Cell<string>, row: Row) => {
      return <CellWrapper cell={cell} closed={RenderTextCell} open={AmountInput} row={row} />;
    },
    title: 'Memo',
  },
  {
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
    render: (cell: Cell<number>) => <RenderCurrencyCell cell={cell} />,
    title: 'Rate',
  },
  {
    dataIndex: 'amountInTargetCurrency',
    key: 'amountInTargetCurrency',
    render: (cell: Cell<number>) => <RenderCurrencyCell cell={cell} />,
    title: 'Target amount',
  },
  {
    dataIndex: 'action',
    key: 'action',
    render: (_, row) => <RowAction row={row} />,
    title: 'Actions',
  },
];
