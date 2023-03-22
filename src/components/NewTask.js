import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NewTask = () => {
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [topics, setTopics] = useState([]);
  const [showTopicSelect, setShowTopicSelect] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [tasktype, setTasktype] = useState([]);
  const [duration, setDuration] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [points, setPoints] = useState([]);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ answer: "" }]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

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
          const response = await axios.get(
            `/courses/${selectedCourse}/topics`
          );
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
    if (e.target.value === "") {
      setShowTopicSelect(false);
      setTopics([]);
    } else {
      setShowTopicSelect(true);
    }
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

  const handleAddAnswer = () => {
    setAnswers([...answers, { answer: "" }]);
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    if (
      !title ||
      !description ||
      !selectedCourse ||
      !selectedTopic ||
      !tasktype ||
      !duration ||
      !difficulty ||
      !points ||
      !question ||
      !answers
    ) {
      setErrMsg(texts.errMsgAllFields);
    }
    e.preventDefault();

    try {
      const taskData = {
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
      await axios.post("/tasks", taskData);
      console.log("Task created successfully");
      navigate("/tasks");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="container-wide">
      <div className="headline">
        {texts.newTask}
        <p className={errMsg ? "errmsg" : "offscreen"}>
          {errMsg}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-col">
            <div className="form-element">
              <label htmlFor="title">{texts.title}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={texts.taskTitlePlaceholder}
              />
            </div>
            <div className="form-element">
              <label htmlFor="course">
                {texts.course}
                <div>
                  <select id="course" onChange={handleCourseSelect}>
                    <option value="">{texts.selectCoursePlaceholder}</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              {showTopicSelect && (
                <div className="form-element">
                  <label htmlFor="topic">
                    {texts.topic}
                    <div>
                      <select id="topic" onChange={handleTopicSelect}>
                        <option value="">{texts.selectTopicPlaceholder}</option>
                        {topics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
              )}
              <label htmlFor="tasktype">
                <div>
                  {texts.tasktype}
                  <div>
                    <select id="tasktype" onChange={handleTasktypeSelect}>
                      <option value="">
                        {texts.selectTasktypePlaceholder}
                      </option>
                      <option value="multipleChoice">
                        {texts.multipleChoice}
                      </option>
                      <option value="freeText">{texts.freeText}</option>
                    </select>
                  </div>
                </div>
              </label>
              <label htmlFor="duration">{texts.duration}</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="90"
                placeholder={texts.taskDurationPlaceholder}
              />
            </div>
          </div>
          <div className="form-col">
            <div className="form-element">
              <label htmlFor="description">{texts.description}</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={texts.taskDescriptionPlaceholder}
              />
            </div>

            <div className="form-element">
              <label htmlFor="points">{texts.points}</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                max="90"
                placeholder={texts.taskPointsPlaceholder}
              />
            </div>
            <div className="form-element">
              <label htmlFor="difficulty">{texts.difficulty}</label>
              <input
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                min="1"
                max="5"
                placeholder={texts.taskDifficultyPlaceholder}
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
            placeholder={texts.taskQuestionPlaceholder}
          ></textarea>
        </div>
        {answers.map((answer, index) => (
          <div key={index}>
            <label htmlFor={`answer-${index}`}>
              {texts.answer} {index + 1}
              <button
                type="button"
                className="RemoveAnswerButton"
                onClick={() => handleRemoveAnswer(index)}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  fontSize="1rem"
                  style={{ color: "black" }}
                />
              </button>
            </label>
            <textarea
              type="text"
              id={`answer-${index}`}
              name="answer"
              value={answer.answer}
              onChange={(e) => handleAnswerChange(e, index)}
              placeholder={texts.taskAnswerPlaceholder}
            />
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
              type="submit"
              className="submitButton"
              disabled={
                !title ||
                !description ||
                !selectedCourse ||
                !selectedTopic ||
                !duration ||
                !difficulty ||
                !points ||
                !question ||
                !answers[0].answer
                  ? true
                  : false
              }
            >
              {texts.createTask}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default NewTask;
