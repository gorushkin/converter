import { makeAutoObservable } from 'mobx';
import { Bank, Currency } from 'src/shared/types';
import { Parser, VakifParser, bogBusinessParser, bogRetailParser } from 'src/utils/parsers';

const parserMapper: Record<Bank, typeof VakifParser | typeof bogRetailParser | typeof bogBusinessParser> = {
  [Bank.BOGBusiness]: bogBusinessParser,
  [Bank.BOGRetail]: bogRetailParser,
  [Bank.TBC]: VakifParser,
  [Bank.VAKIF]: VakifParser,
};

class Settings {
  constructor(
    public bank: Bank,
    public baseCurrency: Currency,
    public isOpen = false
  ) {
    makeAutoObservable(this);
  }

  setBank = (bank: Bank) => {
    this.bank = bank;
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };

  toggle = () => {
    this.isOpen = !this.isOpen;
  };

  get parser(): Parser<unknown, unknown> {
    return new parserMapper[this.bank](this.bank, this.baseCurrency, Currency.RUB);
  }
}

export const settings = new Settings(Bank.BOGRetail, Currency.GEL);
