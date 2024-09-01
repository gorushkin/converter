import { useEffect, useMemo } from 'react';

import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import styles from './Body.module.scss';

import { AmountInput } from 'src/features/AmountInput';
import { DateInput } from 'src/features/DateInput';
import { store, saveRow } from 'src/store';

type Row = {
  date: string;
  amount: number;
  rate: number;
  targetAmount: number;
  mode: 'edit' | 'view';
};

const columns: ColumnsType<Row> = [
  {
    dataIndex: 'date',
    key: 'date',
    render: (text: string, row: Row) => {
      if (row.mode !== 'edit') return text;

      return <DateInput values={row} />;
    },
    title: 'Date',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    render: (text: string, row: Row) => {
      if (row.mode !== 'edit') return text;

      return <AmountInput values={row} />;
    },
    title: 'Amount',
  },
  {
    dataIndex: 'rate',
    key: 'rate',
    title: 'Rate',
  },
  {
    dataIndex: 'targetAmount',
    key: 'targetAmount',
    render: (_: string, row: Row) => {
      const result = row.amount * row.rate;

      return result;
    },
    title: 'Target amount',
  },
];

export const Body = () => {
  const row = store.use.row();
  const rows = store.use.rows();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveRow();
      }
    };

    document.addEventListener('keydown', handlePress);

    return () => {
      document.removeEventListener('keydown', handlePress);
    };
  }, []);

  const data = useMemo(() => [...rows, row], [row, rows]);

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={data} columns={columns} pagination={false} />
    </form>
  );
};
