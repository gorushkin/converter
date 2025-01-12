import { Modal, type ModalType } from 'src/shared/ui/Modal';

type DeleteTransactionModalProps = {
  modal: ModalType;
  onOk: () => void;
};

export const DeleteTransactionModal = (props: DeleteTransactionModalProps) => {
  const { modal, onOk } = props;

  return (
    <Modal okButtonText="Delete" title="Delete?" danger modal={modal} onOk={onOk}>
      <p>Do you want to delete transaction?</p>
    </Modal>
  );
};
