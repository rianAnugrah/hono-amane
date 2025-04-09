export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  
  export const random = function (n: number = 3) {
    return Math.floor(Math.random() * 10 ** n);
  };
  