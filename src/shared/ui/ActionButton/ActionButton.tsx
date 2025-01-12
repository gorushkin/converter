import type { DetailedHTMLProps } from 'react';

import { Tag } from 'antd';
import { cn } from 'src/utils/tools';

import styles from './ActionButton.module.scss';

type Variant = 'alert' | 'primary' | 'success' | 'warning';

const mapping: Record<Variant, string> = {
  alert: '#f50',
  primary: '#108ee9',
  success: '#87d068',
  warning: '#faad14',
};

type ActionButtonProps = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: Variant;
  children: React.ReactNode;
};

export const ActionButton = (props: ActionButtonProps) => {
  const { children, variant, ...rest } = props;

  const color = mapping[variant ?? 'primary'];

  return (
    <button type="button" className={styles.wrapper} {...rest}>
      <Tag className={cn(!!props.disabled && styles.disabled)} bordered color={color}>
        {children}
      </Tag>
    </button>
  );
};
