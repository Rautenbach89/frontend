import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const EditCourse = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [setError] = useState("");
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const courseId = window.location.pathname.split("/").pop();
    setId(courseId);
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/courses/${id}`, JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // TODO: remove console.logs before deployment

        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (err) {
        if (err.response) {
          // Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchCourses(id);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const course = { id, title, description };
      await axios.put(`/courses/${id}`, course);
      navigate("/courses");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.editCourse}</div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">{texts.name}</label>
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
            <button type="submit" className="submitButton">
              {texts.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditCourse;
