import { Button } from 'antd';

import styles from './Selector.module.scss';

type Option<T> = {
  label: string;
  value: T;
};

type SelectorProps<T> = {
  selectedOption: Option<T>['value'];
  onChange: (item: Option<T>['value']) => void;
  options: Option<T>[];
};

export const Selector = <T,>(props: SelectorProps<T>) => {
  const { onChange, options, selectedOption } = props;

  return (
    <div className={styles.buttonWrapper}>
      {options.map((option, index) => {
        const isActive = option.value === selectedOption;
        const buttonType = isActive ? 'primary' : 'default';

        return (
          <Button type={buttonType} key={index} onClick={() => onChange(option.value)}>
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};
