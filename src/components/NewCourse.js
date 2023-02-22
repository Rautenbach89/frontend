import React, { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [setError] = useState("");
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const course = { title, description };
      await axios.post("/courses", course);
      navigate("/courses");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.newCourse}</div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="description">{texts.name}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description">{texts.description}</label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="buttonWrapper">
            <button
              type="submit"
              className="submitButton"
              disabled={!title || !description ? true : false}
            >
              {texts.createCourse}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCourse;
