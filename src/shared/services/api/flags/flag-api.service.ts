import { extractLanguageAndCountryCode } from "../../../helpers/lang.helper";

type FLAG_SIZE = 16 | 24 | 32 | 48 | 64;

export const getFlagLink = (code: string, size: FLAG_SIZE) => {
  if (code && code.trim() != "") {
    return `https://flagsapi.com/${code.toUpperCase()}/flat/${size}.png`;
  }
  return "";
};

export const getFlagLinkFromCompleteCode = (code: string, size: FLAG_SIZE) => {
  return `https://flagsapi.com/${extractLanguageAndCountryCode(
    code
  ).country.toUpperCase()}/flat/${size}.png`;
};
