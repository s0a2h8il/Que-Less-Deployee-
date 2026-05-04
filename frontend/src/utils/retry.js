export const retry = (fn, retries = 3, delay = 500) => {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (n === 0) return reject(err);
          setTimeout(() => attempt(n - 1), delay);
        });
    };
    attempt(retries);
  });
};

export default retry;
