import { useRef, useState } from 'react';

import { CloseCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { useModal } from 'src/shared/hooks/useModal';
import { Currency, Bank } from 'src/shared/types';
import { vakifParser } from 'src/utils/vakifParser';

import styles from './ImportStatement.module.scss';
import { SettingsModal } from './SettingsModal';

export const ImportStatement = observer(() => {
  const {
    currentStatement: { baseCurrency, reset, setBaseCurrency, targetCurrency },
    importStatement,
  } = statementsStore;

  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFilename] = useState('');

  const selectedBank = useRef<Bank | null>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFilename(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result !== 'string') {
          vakifParser.setData(baseCurrency);
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
    setFilename('');
    reset();

    if (!inputRef.current) {
      return;
    }

    inputRef.current.value = '';
  };

  const modal = useModal();

  const handleSave = (currency: Currency, bank: Bank) => {
    setBaseCurrency(currency);
    selectedBank.current = bank;

    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.wrapper}>
      <SettingsModal modal={modal} onSave={handleSave} />
      <Button disabled={!!fileName} onClick={modal.open} type="primary">
        Import
      </Button>
      <input className={styles.input} ref={inputRef} type="file" onChange={handleChange} />
      {fileName && <span className={styles.fileName}>{fileName}</span>}
      {fileName && (
        <button title="Reset file" className={styles.resetButton} onClick={handleResetClick}>
          <CloseCircleFilled />
        </button>
      )}
    </div>
  );
});
