export const counter = (): (() => string) => {
  let i = 0;

  return (): string => {
    i += 1;
    return i.toString();
  };
};
