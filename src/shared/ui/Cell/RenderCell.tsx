import { updateClipboard } from 'src/utils';

type RenderCellProps = {
  value: string;
  toCopyValue: string;
};

export const RenderCell = ({ toCopyValue: copyValue, value }: RenderCellProps) => {
  const handleClick = () => {
    updateClipboard(copyValue);
  };

  return (
    <div style={{ cursor: 'pointer' }} title="Click to copy" onClick={handleClick}>
      {value}
    </div>
  );
};
