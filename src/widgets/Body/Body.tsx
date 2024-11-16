import { useEffect } from 'react';

import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from 'src/store';

import styles from './Body.module.scss';
import { columns } from './columns';

export const Body = observer(() => {
  const { load, rows } = store;

  useEffect(() => {
    load();
  }, [load]);

  return (
    <form className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={rows} columns={columns} pagination={false} />
    </form>
  );
});
