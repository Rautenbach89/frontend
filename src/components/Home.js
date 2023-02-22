import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Home = () => {
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  return (
    <section className="container-wide">
      <div className="headline">{texts.home}</div>
      <div>
        <h1>
          {texts.welcome}
          <br />
          <br />
        </h1>
      </div>
      <div>
        <p>{texts.homeText}</p>
      </div>
    </section>
  );
};

export default Home;
