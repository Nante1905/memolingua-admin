export const extractLanguageAndCountryCode = (code: string) => {
  const items = code.split("-");
  return {
    country: items[1],
    lang: items[0],
  };
};
