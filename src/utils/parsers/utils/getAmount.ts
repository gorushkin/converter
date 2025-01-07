import { parseNumber } from 'src/utils/formatters';

export const getAmount = (inflow?: string, outflow?: string) => {
  if (inflow) {
    return -parseNumber(inflow);
  }

  if (outflow) {
    return parseNumber(outflow);
  }

  return 0;
};
