import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Missing = () => {
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  return (
    <section className="container-wide">
      <div className="headline">{texts.notFound}</div>
      <p>{texts.resourceNotFound}</p>
    </section>
  );
};

export default Missing;
