import { useRef } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { vakifParser } from 'src/utils/vakifParser';

import styles from './ImportStatement.module.scss';

export const ImportStatement = observer(() => {
  const { importStatement } = statementsStore;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result !== 'string') {
          const statement = vakifParser.getData(event.target.result);

          if (statement) {
            importStatement(statement);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleResetClick = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.value = '';
  };

  return (
    <div className={styles.wrapper}>
      <Button type="primary">Import</Button>
      <input ref={inputRef} type="file" onChange={handleChange} />
      <Button type="primary" onClick={handleResetClick}>
        Reset
      </Button>
    </div>
  );
});
