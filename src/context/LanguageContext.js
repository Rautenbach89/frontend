import React, { createContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { auth } = useAuth();
  const [language, setLanguage] = useState(auth?.language || "de");

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);

    const username = auth?.user;
    if (username) {
      axios
        .put("/users", { username: username, language: newLanguage })
        .then((response) => {
          console.log("Language updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Failed to update language:", error);
        });
    }
  };

  useEffect(() => {
    setLanguage(auth?.language);
  }, [auth]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
