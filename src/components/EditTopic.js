import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const EditTopic = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const topicId = window.location.pathname.split("/").pop();
    setId(topicId);
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`/topics/${id}`, JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setTitle(response.data.title);
        setDescription(response.data.description);
        setCourse(response.data.course);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchTopics(id);
  }, [id]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setCourses(response?.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const topic = { id, title, description, course };
      await axios.put(`/topics/${id}`, topic);
      navigate("/topics");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if (err.response.status === 401) {
          setErrMsg(texts.forbiddenError);
        } else if (err.response.status === 404) {
          setErrMsg(texts.notFoundError);
        } else if (err.response.status === 409) {
          setErrMsg(texts.duplicateTopicError);
        } else {
          setErrMsg(texts.error);
        }
      } else {
        console.log(`Error: ${err.message}`);
        setErrMsg(texts.error);
      }
    }
  }

  return (
    <section className="container-wide">
      <div className="headline">{texts.editTopic}</div>
      <p className={errMsg ? "errmsg" : "offscreen"}>
        {errMsg}
      </p>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">{texts.name}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={texts.topicTitlePlaceholder}
          />
          <label htmlFor="description">{texts.description}</label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={texts.topicDescriptionPlaceholder}
          />
          <label htmlFor="course">{texts.course}</label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            
          >
            <option value="">{texts.selectCoursePlaceholder}</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
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

export default EditTopic;
