import { useEffect } from 'react';

import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from 'src/store';
import { updateClipboard, numberToCopyCurrency } from 'src/utils';

import styles from './Body.module.scss';
import { columns } from './columns';

export const Body = observer(() => {
  const { isCurrentRowValid, rows, saveRow, switchActiveInput } = store;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isCurrentRowValid) {
          return switchActiveInput();
        }

        const result = saveRow();
        updateClipboard(numberToCopyCurrency(result));
      }
    };

    document.addEventListener('keydown', handlePress);

    return () => {
      document.removeEventListener('keydown', handlePress);
    };
  }, [isCurrentRowValid, saveRow, switchActiveInput]);

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <Table rowKey={'id'} dataSource={rows} columns={columns} pagination={false} />
    </form>
  );
});
