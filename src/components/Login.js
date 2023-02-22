import { useRef, useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const { language, changeLanguage } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userLanguage = response?.data?.language;

      setAuth({ user, pwd, roles, language, accessToken });
      setUser("");
      setPwd("");
      changeLanguage(userLanguage);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="container-small">
      <div className="loginForm">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <div className="headline">{texts.signIn}</div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">{texts.username}:</label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <label htmlFor="password">{texts.password}:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button className="submitButton">{texts.signIn}</button>
        </form>
        <div className="buttonWrapper">
          <p>
            {texts.needAnAccount}
            <br />
            <br />
            <span className="line">
              <Link className="formLink" to="/register">
                {texts.register}
              </Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
