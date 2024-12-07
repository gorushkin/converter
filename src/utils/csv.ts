import { RowDTO } from 'src/entities/row';

export const getCSV = (data: RowDTO[]) => {
  const rows = data.map((row) => {
    return Object.values(row)
      .map((value) => value)
      .join(',');
  });

  return rows.join('\n');
};
