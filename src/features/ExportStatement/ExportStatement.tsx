import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { getISODate } from 'src/utils/formatters';

export const ExportStatement = observer(() => {
  const { exportCSV } = statementsStore;

  const handleExport = () => {
    const blob = exportCSV();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const title = getISODate();
    link.download = `${title}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} type="primary">
      Export
    </Button>
  );
});
