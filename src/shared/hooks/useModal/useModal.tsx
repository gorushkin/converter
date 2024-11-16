import { useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);
  const toggle = () => setIsModalOpen((prev) => !prev);

  return [isModalOpen, open, close, toggle] as const;
};
