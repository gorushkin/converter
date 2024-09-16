import { useEffect } from 'react';

import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from 'src/store';

import styles from './Body.module.scss';
import { columns } from './columns';

export const Body = observer(() => {
  const { rows, saveRow } = store;
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
  }, [saveRow]);

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={rows} columns={columns} pagination={false} />
    </form>
  );
});
