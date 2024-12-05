import type { StatementDTO } from 'src/entities/statement';

class Storage<T> {
  key = 'statement';
  initialData: T;

  constructor(initialData: T) {
    this.initialData = initialData;
  }

  get() {
    const data = localStorage.getItem(this.key);
    return data ? (JSON.parse(data) as T) : this.initialData;
  }

  set(data: T) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

export class StatementsStorage extends Storage<{ statements: StatementDTO[] }> {
  constructor() {
    super({ statements: [] });
  }

  getAll(): StatementDTO[] {
    return this.get().statements;
  }

  getById(id: string): StatementDTO | undefined {
    return this.get().statements.find((statement) => statement.id === id);
  }

  saveAll(statements: StatementDTO[]) {
    this.set({ statements });
  }

  saveStatement(statement: StatementDTO) {
    const statements = this.getAll();
    const index = statements.findIndex((s) => s.id === statement.id);

    if (index === -1) {
      statements.push(statement);
    } else {
      statements[index] = statement;
    }

    this.saveAll(statements);
  }
}

export const statementsStorage = new StatementsStorage();
