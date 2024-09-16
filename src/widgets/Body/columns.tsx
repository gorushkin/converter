import { ColumnsType } from 'antd/es/table';
import { AmountInput } from 'src/features/AmountInput';
import { DateInput } from 'src/features/DateInput';
import { RenderCell } from 'src/features/RenderCell';
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
    render: (cell: Cell<string>) => <DateInput cell={cell} />,
    title: 'Date',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    render: (cell: Cell<number>) => {
      return <AmountInput cell={cell} />;
    },
    title: 'Amount',
  },
  {
    dataIndex: 'rate',
    key: 'rate',
    render: (cell: Cell<number>) => <RenderCell cell={cell} />,
    title: 'Rate',
  },
  {
    dataIndex: 'result',
    key: 'result',
    render: (cell: Cell<number>) => <RenderCell cell={cell} />,
    title: 'Target amount',
  },
];
