import type { ChangeEvent } from 'react';

import { Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { Modal } from 'src/shared/ui/Modal';

import styles from './SaveStatement.module.scss';

type SaveStatementProps = {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SaveStatement = observer((props: SaveStatementProps) => {
  const { isOpen, onClose } = props;
  const { createStatement, currentStatement } = statementsStore;
  const { name, statement, updateName } = currentStatement;

  const handleSave = () => {
    createStatement(statement);
    onClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateName(e.target.value);
  };

  return (
    <Modal okButtonText="Save" title="Save statement" isOpen={isOpen} onCancel={onClose} onOk={handleSave}>
      <form className={styles.wrapper}>
        <Input className={styles.input} placeholder="Name" value={name} onChange={handleChange} />
      </form>
    </Modal>
  );
});
