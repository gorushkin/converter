export const counter = () => {
  let i = 0;

  return {
    next: () => {
      console.log('next');
      i += 1;
      return i.toString();
    },
    reset: () => {
      console.log('reset');
      i = 0;
    },
  };
};
