import type { ReactNode } from 'react';

import { Modal as AntdModal } from 'antd';

export type CommonModalProps = {
  onOk: () => void;
  onCancel: () => void;
  isOpen: boolean;
};

type ModalProps = {
  children: ReactNode;
  title: string;
} & CommonModalProps;

export const Modal = ({ children, isOpen, onCancel, onOk, title }: ModalProps) => {
  return (
    <AntdModal centered title={title} open={isOpen} onOk={onOk} onCancel={onCancel}>
      {children}
    </AntdModal>
  );
};
