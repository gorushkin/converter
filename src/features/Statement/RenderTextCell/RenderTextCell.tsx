import { observer } from 'mobx-react-lite';
import { RenderCell } from 'src/shared/ui/Cell';

type RenderTextCellProps = {
  value: string;
};

export const RenderTextCell = observer(({ value }: RenderTextCellProps) => (
  <RenderCell value={value} toCopyValue={value} />
));
