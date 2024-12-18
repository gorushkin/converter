import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { EditableField } from 'src/shared/ui/EditableField';

export const StatementEditableName = observer(() => {
  const {
    currentStatement: { name, updateName },
  } = statementsStore;

  return <EditableField tag="h1" value={name || 'NoName'} onSubmit={updateName} />;
});
