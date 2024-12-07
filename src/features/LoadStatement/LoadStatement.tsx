import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { Modal } from 'src/shared/ui/Modal';

import styles from './LoadStatement.module.scss';

type SaveStatementProps = {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const LoadStatement = observer((props: SaveStatementProps) => {
  const { isOpen, onClose } = props;
  const { statements } = statementsStore;

  const handleClick = (id: string) => {
    statementsStore.loadStatement(id);
    onClose();
  };

  return (
    <Modal okButtonText="Save" title="Load statement" isOpen={isOpen} onCancel={onClose}>
      <ul className={styles.wrapper}>
        {statements.map((s) => (
          <li key={s.id}>
            <button className={styles.button} onClick={() => handleClick(s.id)}>
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
});
