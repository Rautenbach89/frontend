import { Link } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import en from "../../lang/en.json";
import de from "../../lang/de.json";

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  return (
    <footer>
      <div>
        <Link className="Impressum" to="/impressum">
          <p>{texts.imprintAndPrivacy}</p>
        </Link>
      </div>
      <div className="Copyright">
        <p>Copyright © 2023</p>
      </div>
    </footer>
  );
};

export default Footer;
