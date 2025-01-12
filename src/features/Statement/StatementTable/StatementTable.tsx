import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';

import { columns } from './columns';
import styles from './StatementTable.module.scss';

export const StatementTable = observer(() => {
  const { currentStatement } = statementsStore;

  const { data } = currentStatement;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={styles.wrapper}
    >
      <Table rowKey={'id'} dataSource={data} columns={columns} pagination={false} />
    </form>
  );
});
