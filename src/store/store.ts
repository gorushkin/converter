import { counter } from 'src/utils';
import { create, StoreApi, UseBoundStore } from 'zustand';

import { Row, InputType } from './types';

const getId = counter() as () => string;

type State = {
  row: Row;
  rows: Row[];
  activeInput: InputType;
};

const initialState: State = {
  activeInput: 'date',
  row: { amount: 0, date: '', id: getId(), mode: 'edit', rate: 0, targetAmount: 0 },
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

export const updateRow = (field: string, value: string) => {
  usePersonStore.setState((state) => ({ row: { ...state.row, [field]: value } }));
};

export const saveRow = () =>
  usePersonStore.setState((state) => ({
    activeInput: 'date',
    row: { ...initialState.row, id: getId() },
    rows: [...state.rows, { ...state.row, mode: 'view' }],
  }));

export const setActiveInput = (activeInput: InputType) => usePersonStore.setState({ activeInput });
