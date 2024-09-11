import { counter } from 'src/utils';
import { create, StoreApi, UseBoundStore } from 'zustand';

import { Row, InputType } from './types';

const getId = counter() as () => string;

const dateValidator = (date: string) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;

  return dateRegex.test(date);
};

const amountValidator = (amount: string) => {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount) && parseFloat(amount) > 0;
};

export const validators: Record<InputType, (value: string) => boolean> = {
  amount: amountValidator,
  date: dateValidator,
};

type State = {
  row: Row;
  rows: Row[];
  activeInput: InputType;
  isActive: (name: InputType) => boolean;
};

const initialState: State = {
  activeInput: 'date',
  isActive: (name) => initialState.activeInput === name,
  row: { amount: 0, date: '', id: getId(), isValid: false, mode: 'edit', rate: 0, targetAmount: 0 },
  rows: [],
};

export const usePersonStore = create<State>(() => ({ ...initialState }));

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const store = createSelectors(usePersonStore);

export const updateRow = (field: 'date' | 'amount' | 'rate', value: string) => {
  usePersonStore.setState((state) => ({ row: { ...state.row, [field]: value } }));
};

export const saveRow = () =>
  usePersonStore.setState((state) => ({
    activeInput: 'date',
    row: { ...initialState.row, id: getId() },
    rows: [...state.rows, { ...state.row, mode: 'view' }],
  }));

export const setActiveInput = (activeInput: InputType) => usePersonStore.setState({ activeInput });

export const verifyRow = () => {
  const row = store.use.row();

  return validators.date(row.date) && validators.amount(row.amount.toString());
};
