import { observer } from 'mobx-react-lite';
import { store } from 'src/store';

type RowActionProps = {
  className?: string;
  id: string;
};
export const RowAction = observer(({ id }: RowActionProps) => {
  const handleRemoveClick = () => {
    store.removeRow(id);
  };

  return (
    <div>
      <button onClick={handleRemoveClick}>delete</button>
    </div>
  );
});
