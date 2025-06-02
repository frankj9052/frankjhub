export const fetchdata = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: 'Mocked API Data' });
    }, 1000);
  });
};
