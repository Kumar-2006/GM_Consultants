const createFallbackStorage = () => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

export const safeLocalStorage =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : createFallbackStorage();

export const safeSessionStorage =
  typeof window !== "undefined" && window.sessionStorage
    ? window.sessionStorage
    : createFallbackStorage();

if (typeof global !== "undefined") {
  if (!global.localStorage) global.localStorage = safeLocalStorage;
  if (!global.sessionStorage) global.sessionStorage = safeSessionStorage;
}
