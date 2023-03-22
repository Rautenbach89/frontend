import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const ShowExam = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [course, setCourse] = useState("");
  const [blocks, setBlocks] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [examPoints, setExamPoints] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const examId = window.location.pathname.split("/").pop();
    const fetchExams = async (examId) => {
      try {
        const response = await axios.get(`/exams/${examId}`, JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setTitle(response.data.title);
        setCourse(response.data.course);
        setNotes(response.data.notes);
        setBlocks(response.data.blocks);
        setExamDuration(response.data.examDuration);
        setExamPoints(response.data.examPoints);
        setIsLoading(false);
        console.log(response.data);
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

    fetchExams(examId);
  }, []);

  if (isLoading) {
    return <div>{texts.loading}</div>;
  }

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
                <h1 className="exam-headline">{texts.examInfo}</h1>
              </li>
              <li>
                {texts.duration}: {examDuration} {texts.minutes}
              </li>
              <li>
                {texts.points}: {examPoints} {texts.points}
              </li>
              <li>
                {texts.course}: {course}
              </li>
            </div>
            <div className="notes-container">
              <li>
                <h1 className="exam-headline">{texts.notes}:</h1>
              </li>
              <li className="notes">{notes}</li>
            </div>
            {blocks.map((block, index) => (
              <div key={index} className="block-container">
                <h1 className="exam-headline">{block.blockName}:</h1>
                <div className="block-info">
                  <li>
                    {texts.blockDuration}: {block.blockDuration}
                  </li>
                  <li>
                    {texts.points}: {block.blockPoints}
                  </li>
                </div>
                {block.blockTasks.map((blocktask, index) => (
                  <div key={index} className="block-task-container">
                    <li className="block-task">
                      {texts.title}: {blocktask.title}
                    </li>
                    <li className="block-task">
                      {texts.question}: {blocktask.question}
                    </li>
                    <div className="answers-container">
                      {blocktask.answers.map((answer, index) => (
                        <div key={index} className="answer-container">
                          <li>
                            {texts.answer}: {answer.answer}
                          </li>
                          <li>
                            {texts.correct}:{" "}
                            {answer.isCorrect ? texts.yes : texts.no}
                          </li>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShowExam;

