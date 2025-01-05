import type { SettingsDTO } from 'src/entities/settings/settings';
import type { StatementDTO } from 'src/entities/statement';
import { Bank, Currency } from 'src/shared/types';

class Storage<T> {
  key: string;
  initialData: T;

  constructor(key: string, initialData: T) {
    this.key = key;
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

export class SettingsStorage extends Storage<SettingsDTO> {
  constructor(settings: SettingsDTO) {
    super('settings', settings);
  }

  getBank() {
    return this.get().bank;
  }

  getBaseCurrency() {
    return this.get().baseCurrency;
  }

  setBank(bank: SettingsDTO['bank']) {
    this.set({ ...this.get(), bank });
  }

  setBaseCurrency(baseCurrency: SettingsDTO['baseCurrency']) {
    this.set({ ...this.get(), baseCurrency });
  }
}

export class StatementsStorage extends Storage<{ statements: StatementDTO[] }> {
  constructor() {
    super('statements', { statements: [] });
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
export const settingStorage = new SettingsStorage({ bank: Bank.BOGBusiness, baseCurrency: Currency.USD });
