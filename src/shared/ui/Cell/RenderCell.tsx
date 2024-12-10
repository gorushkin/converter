import { updateClipboard } from 'src/utils';

import styles from './RenderCell.module.scss';

type RenderCellProps = {
  value: string;
  toCopyValue: string;
};

export const RenderCell = ({ toCopyValue: copyValue, value }: RenderCellProps) => {
  const handleClick = () => {
    updateClipboard(copyValue);
  };

  return (
    <div className={styles.wrapper} title="Click to copy" onClick={handleClick}>
      {value}
    </div>
  );
};
