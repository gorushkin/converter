import type { DetailedHTMLProps } from 'react';

import { Tag } from 'antd';
import { cn } from 'src/utils/tools';

import styles from './ActionButton.module.scss';

type ActionButtonProps = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color?: string;
  children: React.ReactNode;
};

export const ActionButton = (props: ActionButtonProps) => {
  const { children, color, ...rest } = props;

  if (props.disabled) {
    return null;
  }

  return (
    <button type="button" className={styles.wrapper} {...rest}>
      <Tag className={cn(!!props.disabled && styles.disabled)} bordered color={color}>
        {children}
      </Tag>
    </button>
  );
};
