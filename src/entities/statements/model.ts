import type { StatementDTO } from 'src/entities/statement/';

class Statements {
  data: StatementDTO[] = [];

  saveStatement = () => {
    throw new Error('Method not implemented.');
  };

  loadStatement = () => {
    throw new Error('Method not implemented.');
  };

  deleteStatement = () => {
    throw new Error('Method not implemented.');
  };

  updateStatement = () => {
    throw new Error('Method not implemented.');
  };

  exportCSV = (): Blob => {
    throw new Error('Method not implemented.');
  };
}

export const statements = new Statements();
