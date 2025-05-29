import en from "../messages/en.json";
import pt from "../messages/pt.json";

type Messages = typeof pt;

const messagesByLocale: Record<string, Messages> = { en, pt };

const nextIntl = {
  defaultLocale: "pt",
  messagesByLocale,
};

export default nextIntl;
