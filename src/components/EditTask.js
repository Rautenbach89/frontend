import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const NewTask = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [tasktype, setTasktype] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [points, setPoints] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ answer: "", isCorrect: false }]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const taskId = window.location.pathname.split("/").pop();
    setId(taskId);
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/${id}`, JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // TODO: remove console.logs before deployment

        setTitle(response.data.title);
        setDescription(response.data.description);
        setSelectedCourse(response.data.course);
        setSelectedTopic(response.data.topic);
        setTasktype(response.data.tasktype);
        setDuration(response.data.duration);
        setDifficulty(response.data.difficulty);
        setPoints(response.data.points);
        setQuestion(response.data.question);
        setAnswers(response.data.answers.map((answer) => answer.answer));
        setAnswers(response.data.answers);
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

    fetchTask(id);
  }, [id]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses");
        setCourses(response.data);
        setTopics([]);
        if (response.data.length === 1) {
          setSelectedCourse(response.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedCourse) {
        try {
          const response = await axios.get(`/courses/${selectedCourse}/topics`);
          setTopics(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchTopics();
  }, [selectedCourse]);

  const handleCourseSelect = (e) => {
    setSelectedCourse(e.target.value);
    setTopics([]);
  };

  const handleTopicSelect = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleTasktypeSelect = (event) => {
    setTasktype(event.target.value);
  };

  const handleAnswerChange = (e, index) => {
    const { name, value } = e.target;
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [name]: value };
    setAnswers(newAnswers);
  };

  const handleCorrectChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[index] = {
      ...newAnswers[index],
      isCorrect: !newAnswers[index].isCorrect,
    };
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { answer: "", isCorrect: false }]);
  };

  const handleRemoveAnswer = () => {
    const newAnswers = [...answers];
    newAnswers.splice(-1, 1);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const task = {
        id,
        title,
        description,
        course: selectedCourse,
        topic: selectedTopic,
        tasktype,
        duration,
        difficulty,
        points,
        question,
        answers,
        user: auth?.user.toString(),
      };
      await axios.put(`/tasks/${id}`, task);
      navigate("/tasks");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.editTask}</div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-col">
            <div className="form-element">
              <label htmlFor="title">{texts.title}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-element">
              <label htmlFor="course">
                {texts.course}
                <div>
                  <select id="course" onChange={handleCourseSelect}>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label htmlFor="tasktype">
                {texts.tasktype}
                <div>
                  <select id="tasktype" onChange={handleTasktypeSelect}>
                    <option value="">{texts.selectTaskType}</option>
                    <option value="multipleChoice">
                      {texts.multipleChoice}
                    </option>
                    <option value="freeText">{texts.freeText}</option>
                  </select>
                </div>
              </label>
              <label htmlFor="duration">
                {texts.duration} {texts.inMinutes}
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="form-col">
            <div className="form-element">
              <label htmlFor="description">{texts.description}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-element">
              <label htmlFor="topic">
                {texts.topic}
                <div>
                  <select id="topic" onChange={handleTopicSelect}>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label htmlFor="points">{texts.points}</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
              <label htmlFor="difficulty">
                {texts.difficulty} {texts.inNumbers} 1-5
              </label>
              <input
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                min="1"
                max="5"
              />
            </div>
          </div>
        </div>

        <div className="form-element">
          <label for="question">{texts.question}</label>
          <textarea
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            id="question"
            name="question"
          ></textarea>
        </div>
        {answers.map((answer, index) => (
          <div key={index}>
            <label htmlFor={`answer-${index}`}>
              {texts.answer} {index + 1}
            </label>
            <input
              type="text"
              id={`answer-${index}`}
              name="answer"
              value={answer.answer}
              onChange={(e) => handleAnswerChange(e, index)}
            />
            <div>
              <label htmlFor={`correct-${index}`}>
                {texts.correct}
                <div>
                  <input
                    className="checkbox"
                    type="checkbox"
                    id={`correct-${index}`}
                    name="isCorrect"
                    checked={answer.isCorrect}
                    onChange={() => handleCorrectChange(index)}
                  />
                </div>
              </label>
            </div>
          </div>
        ))}
        <div className="buttonWrapper">
          <div>
            <button
              type="button"
              className="submitButton"
              onClick={handleAddAnswer}
            >
              {texts.addAnswer}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="submitButton"
              onClick={handleRemoveAnswer}
            >
              {texts.removeAnswer}
            </button>
          </div>
          <div>
            <button type="submit" className="submitButton">
              {texts.saveChanges}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default NewTask;
