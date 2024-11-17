import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';

import styles from './Body.module.scss';
import { columns } from './columns';

export const Body = observer(() => {
  const { data } = statementsStore.currentStatement;

  return (
    <form className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={data} columns={columns} pagination={false} />
    </form>
  );
});
