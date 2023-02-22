import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Unauthorized = () => {
  const navigate = useNavigate();

  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  const goBack = () => navigate(-1);

  return (
    <section className="container-wide">
      <div className="headline">{texts.unauthorized}</div>
      <br />
      <p>{texts.dontHavePermission}</p>
      <div className="flexGrow">
        <button className="submitButton" onClick={goBack}>
          {texts.goBack}
        </button>
      </div>
    </section>
  );
};

export default Unauthorized;
