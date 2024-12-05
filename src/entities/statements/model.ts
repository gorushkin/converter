import { makeAutoObservable, runInAction } from 'mobx';
import type { StatementDTO } from 'src/entities/statement';
import { Statement } from 'src/entities/statement';
import { getCurrentDate, statementsStorage } from 'src/utils';
import { getId } from 'src/utils/getId';
import type { StatementsStorage } from 'src/utils/storage';

class Statements {
  statements: StatementDTO[] = [];

  currentStatement: Statement;
  storage: StatementsStorage = statementsStorage;

  constructor() {
    this.currentStatement = new Statement();

    makeAutoObservable(this);
  }

  init = () => {
    this.statements = this.storage.getAll();
  };

  saveStatement = () => {
    this.storage.saveStatement(this.currentStatement.statement);
  };

  updateStatement = (statement: StatementDTO) => {
    runInAction(() => {
      this.statements = this.statements.map((s) => (s.id === statement.id ? statement : s));
      this.saveStatement();
    });
  };

  createStatement = (rawStatement: StatementDTO) => {
    const id = String(getId());
    const date = getCurrentDate();

    runInAction(() => {
      this.currentStatement.id = id;
      this.currentStatement.date = date;
      this.statements.push({ ...rawStatement, date, id });
      this.saveStatement();
    });
  };

  loadStatement = (id: string) => {
    const statement = this.statements.find((s) => s.id === id);

    this.currentStatement.load(statement);
  };

  deleteStatement = () => {
    throw new Error('Method not implemented.');
  };

  exportCSV = (): Blob => {
    throw new Error('Method not implemented.');
  };
}

export const statementsStore = new Statements();
