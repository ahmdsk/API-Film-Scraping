import { Config } from "../Config";

export default function removeUrl(url: string) {
  const urlNew = url.replace(new RegExp(Config.filmURL, "g"), "");
  const result = urlNew.replace(new RegExp("/", "g"), "");

  return result;
}
