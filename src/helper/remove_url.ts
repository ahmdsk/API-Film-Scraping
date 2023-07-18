import { Config } from "../Config";

export default function removeUrl(url: string) {
  const urlNew = url.replace(new RegExp(Config.filmURL, "g"), "");
  let result;

  if (urlNew.endsWith('/')) {
    result = urlNew.slice(0, -1);
  }

  return result;
}
