import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Imprint = () => {

  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  return (
    <section className="container-wide">
      <div className="headline">{texts.imprint}</div>
      <br />
      <p>{texts.imprintText}</p>
    </section>
  );
};

export default Imprint;
