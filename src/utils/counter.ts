export const counter = () => {
  let i = 0;

  return {
    next: () => {
      i += 1;
      return i.toString();
    },
    reset: () => {
      i = 0;
    },
    set: (value: number) => {
      i = value;
    },
  };
};
