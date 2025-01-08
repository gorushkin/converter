import { useRef, useState } from 'react';

import { CloseCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { settings } from 'src/entities/settings/settings';
import { statementsStore } from 'src/entities/statements';

import styles from './ImportStatement.module.scss';

export const ImportStatement = observer(() => {
  const {
    currentStatement: { reset },
    importStatement,
  } = statementsStore;

  const { isCSV, isXLSX, parser } = settings;

  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFilename] = useState('');

  const handleReset = () => {
    setFilename('');
    reset();

    if (!inputRef.current) {
      return;
    }

    inputRef.current.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFilename(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const statement = parser.getData(event.target.result);

          if (statement) {
            importStatement(statement);
          }
        }
      };

      if (isCSV) reader.readAsText(file);
      if (isXLSX) reader.readAsArrayBuffer(file);
    }
  };

  const handleButtonClick = () => {
    handleReset();

    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.wrapper}>
      <Button onClick={handleButtonClick} type="primary">
        Import
      </Button>
      <input className={styles.input} ref={inputRef} type="file" onChange={handleChange} />
      {fileName && <span className={styles.fileName}>{fileName}</span>}
      {fileName && (
        <button title="Reset file" className={styles.resetButton} onClick={handleReset}>
          <CloseCircleFilled />
        </button>
      )}
    </div>
  );
});
