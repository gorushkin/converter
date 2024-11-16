import { Input } from 'antd';
import { Modal } from 'src/shared/ui/Modal';

import styles from './SaveStatement.module.scss';

type SaveStatementProps = {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SaveStatement = (props: SaveStatementProps) => {
  const { isOpen, onClose } = props;

  return (
    <Modal title="Save statement" isOpen={isOpen} onCancel={onClose} onOk={onClose}>
      <form className={styles.wrapper}>
        <Input className={styles.input} placeholder="Name" />
      </form>
    </Modal>
  );
};
