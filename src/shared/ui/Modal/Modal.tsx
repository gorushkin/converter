import type { ReactNode } from 'react';

import { Modal as AntdModal, Button } from 'antd';

export type ModalType = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
};

type ModalProps = {
  children: ReactNode;
  title: string;
  onOk?: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
  okButtonText?: string;
  cancelButtonText?: string;
  onClose?: () => void;
  modal?: ModalType;
};

export const Modal = (props: ModalProps) => {
  const { cancelButtonText, children, isOpen, modal, okButtonText, onCancel, onOk, title } = props;

  const isModalOpen = modal ? modal.isOpen : isOpen;
  const closeModal = modal ? modal.close : onCancel;

  const handleCancelClick = () => {
    onCancel?.();
    closeModal?.();
  };

  const handleOkClick = () => {
    onOk?.();
    closeModal?.();
  };

  return (
    <AntdModal
      footer={(_, { CancelBtn, OkBtn }) => {
        return (
          <>
            <>
              {cancelButtonText && <Button onClick={handleCancelClick}>{cancelButtonText}</Button>}
              {!cancelButtonText && <CancelBtn />}
            </>
            {!!onOk && (
              <>
                {okButtonText && (
                  <Button onClick={handleOkClick} type="primary">
                    {okButtonText}
                  </Button>
                )}
                {!okButtonText && <OkBtn />}
              </>
            )}
          </>
        );
      }}
      centered
      title={title}
      open={isModalOpen}
      onOk={handleOkClick}
      onCancel={handleCancelClick}
    >
      {children}
    </AntdModal>
  );
};
