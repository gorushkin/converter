import type { ReactNode } from 'react';

import { Modal as AntdModal, Button } from 'antd';

type ModalProps = {
  children: ReactNode;
  title: string;
  onOk?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  okButtonText?: string;
  cancelButtonText?: string;
  onClose?: () => void;
};

export const Modal = (props: ModalProps) => {
  const { cancelButtonText, children, isOpen, okButtonText, onCancel, onOk, title } = props;

  return (
    <AntdModal
      footer={(_, { CancelBtn, OkBtn }) => {
        return (
          <>
            {!!onCancel && (
              <>
                {cancelButtonText && <Button>{cancelButtonText}</Button>}
                {!cancelButtonText && <CancelBtn />}
              </>
            )}
            {!!onOk && (
              <>
                {okButtonText && (
                  <Button onClick={onOk} type="primary">
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
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
    >
      {children}
    </AntdModal>
  );
};
