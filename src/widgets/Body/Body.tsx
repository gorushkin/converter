import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { statement } from 'src/entities/statement/model';

import styles from './Body.module.scss';
import { columns } from './columns';

export const Body = observer(() => {
  const { rows } = statement;

  return (
    <form className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={rows} columns={columns} pagination={false} />
    </form>
  );
});
