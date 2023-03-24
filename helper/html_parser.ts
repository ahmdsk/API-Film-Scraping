import axios from "axios";

export async function getHtmlData(url: string) {
  return await axios
    .get(url)
    .then(({ data }) => data)
    .catch((err) => console.log(err));
}
