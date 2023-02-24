import useAuth from "../../hooks/useAuth";
import AuthContext from "../../context/AuthProvider";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import en from "../../lang/en.json";
import de from "../../lang/de.json";
import {
faBars
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ toggleSidebar }) => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { language, changeLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  const texts = language === "en" ? en : de;

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    navigate("/login");
  };

  return auth?.user ? (
    <header>
      <div className="navIconWrapper">
        <div className="toggleNav" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} fontSize="1.6rem" />
        </div>
      </div>
      <div className="title">{texts.siteTitle}</div>
      <div className="logoutContainer">
        <select
          className="languageSelect"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">{texts.english}</option>
          <option value="de">{texts.german}</option>
        </select>
        <button
          className="logoutButton"
          onClick={() => {
            logout();
          }}
        >
          {texts.signOut}
        </button>
      </div>
    </header>
  ) : (
    <header>
      <div></div>
      <div className="title">{texts.siteTitle}</div>
      <div className="logoutContainer">
        <select
          className="languageSelect"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">{texts.english}</option>
          <option value="de">{texts.german}</option>
        </select>
        <Link to="/login">
          <button className="logoutButton" onClick={logout}>
            {" "}
            {texts.signIn}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
