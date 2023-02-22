import React, { createContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { auth } = useAuth();
  const [language, setLanguage] = useState(auth?.language || "de"); // default language is English or user's preferred language

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);

    // Update the user's language in the database if logged in
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

  // Update the language when the user changes
  useEffect(() => {
    setLanguage(auth?.language);
  }, [auth]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
