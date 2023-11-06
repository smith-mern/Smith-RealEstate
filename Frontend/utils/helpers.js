export const uniqueArray = (arr, prop) =>
  Array.from(new Set(arr.map((obj) => obj[prop]))).map((id) =>
    arr.find((o) => o[prop] === id)
  );
