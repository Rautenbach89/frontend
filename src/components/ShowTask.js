import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const ShowTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [tasktype, setTasktype] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [points, setPoints] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const taskId = window.location.pathname.split("/").pop();
    const fetchTasks = async (taskId) => {
      try {
        const response = await axios.get(
          `/tasks/show/${taskId}`,
          JSON.stringify(),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCourse(response.data.course);
        setTopic(response.data.topic);
        setTasktype(response.data.tasktype);
        setDuration(response.data.duration);
        setDifficulty(response.data.difficulty);
        setPoints(response.data.points);
        setQuestion(response.data.question);
        setAnswers(response.data.answers);
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

    fetchTasks(taskId);
  }, []);

  return (
    <section className="container-wide">
      <div className="headline">
        {texts.title}: {title}
      </div>
      <div>
        <div className="exam">
          <ul>
            <div className="exam-info">
              <li>
                <h1 className="exam-headline">{texts.taskInfo}</h1>
              </li>
              <li>
                {texts.description}: {description}
              </li>
              <li>
                {texts.course}: {course}{" "}
              </li>
              <li>
                {texts.topic}: {topic}
              </li>
              <li>
                {texts.tasktype}: {tasktype}
              </li>
              <li>
                {texts.duration}: {duration} {texts.minutes}
              </li>
              <li>
                {texts.difficulty}: {difficulty}
              </li>
              <li>
                {texts.points}: {points}
              </li>
            </div>
            <div className="block-container">
              <h1 className="exam-headline">{texts.question}:</h1>
              <div className="block-info">
                <li> {question}</li>
              </div>
            </div>
            {answers.map((answer, index) => (
              <div key={index} className="block-container">
                <h1 className="exam-headline">
                  {texts.answer} {index + 1}:
                </h1>
                <div className="block-info">
                  <li>{answer.answer}</li>
                  <li>
                    <br /> <br />
                    {texts.correct}: {answer.isCorrect ? texts.yes : texts.no}
                  </li>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShowTask;
