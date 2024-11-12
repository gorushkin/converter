import { RowValues } from 'src/store/row';

export const getCSV = (data: RowValues[]) => {
  const rows = data.map((row) => {
    return Object.values(row)
      .map((value) => value)
      .join(',');
  });

  return rows.join('\n');
};
