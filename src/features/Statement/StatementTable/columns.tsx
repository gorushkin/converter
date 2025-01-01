import { ColumnsType } from 'antd/es/table';
import type { Cell } from 'src/entities/row';
import type { TableRow } from 'src/entities/statement';
import { AmountInput } from 'src/features/Statement/AmountInput';
import { CellWrapper } from 'src/features/Statement/CellWrapper';
import { DateInput } from 'src/features/Statement/DateInput';
import { RateInput } from 'src/features/Statement/RateInput';
import { RenderCurrencyCell } from 'src/features/Statement/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/Statement/RenderTextCell';
import { RowAction } from 'src/features/Statement/RowAction';

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
    render: (cell: Cell<string>, row) => <CellWrapper cell={cell} closed={RenderTextCell} open={DateInput} row={row} />,
    title: 'Date',
  },
  {
    dataIndex: 'outflow',
    key: 'outflow',
    render: (cell: Cell<number>, row) => (
      <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />
    ),
    title: 'Outflow',
  },
  {
    dataIndex: 'inflow',
    key: 'inflow',
    render: (cell: Cell<number>, row) => (
      <CellWrapper cell={cell} closed={RenderCurrencyCell} open={AmountInput} row={row} />
    ),
    title: 'Inflow',
  },
  {
    dataIndex: 'amountInBaseCurrency',
    key: 'amountInBaseCurrency',
    render: (cell: Cell<string>) => <RenderTextCell cell={cell} />,
    title: 'amount',
  },
  {
    dataIndex: 'runningBalance',
    key: 'runningBalance',
    render: (cell: Cell<number>) => <RenderCurrencyCell cell={cell} />,
    title: 'Running balance',
  },
  {
    dataIndex: 'memo',
    key: 'memo',
    render: (cell: Cell<string>, row) => (
      <CellWrapper cell={cell} closed={RenderTextCell} open={AmountInput} row={row} />
    ),
    title: 'Memo',
  },
  {
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
    render: (cell: Cell<number>) => <RateInput cell={cell} />,
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
