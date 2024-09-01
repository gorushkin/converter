const generateRandomNumber = (): number => {
  return Math.random() * 100 + 1;
};

export const getRate = (_date: string, _currency: string, _baseCurrency = 'rub'): number => {
  const result = generateRandomNumber();

  return result;
};
