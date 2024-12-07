import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsModalOpen] = useState(false);

  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);
  const toggle = () => setIsModalOpen((prev) => !prev);

  return { close, isOpen, open, toggle };
};
