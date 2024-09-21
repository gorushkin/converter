import { ColumnsType } from 'antd/es/table';
import { AmountInput } from 'src/features/AmountInput';
import { DateInput } from 'src/features/DateInput';
import { RenderCurrencyCell } from 'src/features/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/RenderTextCell';
import { Cell, Row } from 'src/store';

export const columns: ColumnsType<Row> = [
  {
    dataIndex: 'id',
    key: 'id',
    render: (id: string) => id,
    title: 'Date',
  },
  {
    dataIndex: 'date',
    key: 'date',
    render: (cell: Cell<string>, row: Row) => {
      return row.isOpen ? <RenderTextCell cell={cell} /> : <DateInput cell={cell} />;
    },
    title: 'Date',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    render: (cell: Cell<number>, row: Row) => {
      return row.isOpen ? <RenderCurrencyCell cell={cell} /> : <AmountInput cell={cell} />;
    },
    title: 'Amount',
  },
  {
    dataIndex: 'rate',
    key: 'rate',
    render: (cell: Cell<number>) => <RenderCurrencyCell cell={cell} />,
    title: 'Rate',
  },
  {
    dataIndex: 'result',
    key: 'result',
    render: (cell: Cell<number>) => {
      return <RenderCurrencyCell cell={cell} />;
    },
    title: 'Target amount',
  },
];
