import { ColumnsType } from 'antd/es/table';
import type { Cell, Row } from 'src/entities/row';
import { AmountInput } from 'src/features/table/AmountInput';
import { DateInput } from 'src/features/table/DateInput';
import { RenderCurrencyCell } from 'src/features/table/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/table/RenderTextCell';
import { RowAction } from 'src/features/table/RowAction';

export const columns: ColumnsType<Row> = [
  {
    dataIndex: 'id',
    key: 'id',
    render: (id: string) => id,
    title: '#',
  },
  {
    dataIndex: 'date',
    key: 'date',
    render: (cell: Cell<string>, row: Row) => {
      return row.isViewMode ? <RenderTextCell cell={cell} /> : <DateInput cell={cell} />;
    },
    title: 'Date',
  },
  {
    dataIndex: 'outflow',
    key: 'outflow',
    render: (cell: Cell<number>, row: Row) => {
      return row.isViewMode ? <RenderCurrencyCell cell={cell} /> : <AmountInput cell={cell} />;
    },
    title: 'Outflow',
  },
  {
    dataIndex: 'inflow',
    key: 'inflow',
    render: (cell: Cell<number>, row: Row) => {
      return row.isViewMode ? <RenderCurrencyCell cell={cell} /> : <AmountInput cell={cell} />;
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
      return row.isViewMode ? <RenderTextCell cell={cell} /> : <AmountInput cell={cell} />;
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
    render: (cell: Cell<number>) => {
      return <RenderCurrencyCell cell={cell} />;
    },
    title: 'Target amount',
  },
  {
    dataIndex: 'action',
    key: 'action',
    render: (_, row) => <RowAction row={row} />,
    title: 'Actions',
  },
];
