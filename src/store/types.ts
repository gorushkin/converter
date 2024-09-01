export type Row = {
  date: string;
  amount: number;
  rate: number;
  targetAmount: number;
  mode: 'edit' | 'view';
  id?: string;
};

export type InputType = 'date' | 'amount';
