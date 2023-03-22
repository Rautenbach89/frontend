import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LanguageContext } from "../context/LanguageContext";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import en from "../lang/en.json";
import de from "../lang/de.json";

function ExamForm() {
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();
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
    setTopics([]);
  };

  const handleTopicChange = (e, index) => {
    const newBlocks = [...blocks];
    newBlocks[index].topic = e.target.value;
    setBlocks(newBlocks);
  };

  const handleAddBlock = () => {
    setBlocks([...blocks, { blockName: "", blockDuration: "", topic: "" }]);
  };

  const handleDeleteBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleBlockChange = (index, event) => {
    const { name, value } = event.target;
    const newBlocks = [...blocks];
    newBlocks[index][name] = value;
    setBlocks(newBlocks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isBlockNameDefined = blocks.every((block) => block.blockName);
    const isBlockDurationDefined = blocks.every((block) => block.blockDuration);
    const isBlockTopicDefined = blocks.every((block) => block.topic);

    if (!isBlockNameDefined) {
      setErrMsg(texts.blockMissingName);
      return;
    }
    if (!isBlockDurationDefined) {
      setErrMsg(texts.blockMissingDuration);
      return;
    }
    if (!isBlockTopicDefined) {
      setErrMsg(texts.blockMissingTopic);
      return;
    }
    const examData = {
      title,
      course: selectedCourse,
      createdBy: auth?.user.toString(),
      notes,
      blocks,
    };
    try {
      await axios.post("/exams", examData);
      navigate("/exams");
    } catch (error) {
      console.error(error);
      setErrMsg(texts.errNewExam);
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.newExam}</div>
      <form onSubmit={handleSubmit}>
        <label>
          {texts.title}
          <div>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={texts.examTitlePlaceholder}
            />
          </div>
        </label>
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
        <label>
          {texts.notes}
          <textarea
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value.split("\n"))}
            placeholder={texts.examImportantNotesPlaceholder}
          />
        </label>
                {blocks.map((block, index) => (
         <div key={index}>
         <label htmlFor={`answer-${index}`}>
           {texts.block} {index + 1}
           <button
             type="button"
             className="RemoveAnswerButton"
             onClick={() => handleDeleteBlock(index)}
           >
             <FontAwesomeIcon
               icon={faTrash}
               fontSize="1rem"
               style={{ color: "black" }}
             />
           </button>
         </label>
                <input
                  type="text"
                  name="blockName"
                  value={block.blockName}
                  onChange={(event) => handleBlockChange(index, event)}
                  placeholder={texts.examSubjectAreaNamePlaceholder}
                />
            <label>
              {texts.blockDuration} {texts.inMinutes}
              <div>
                <input
                  type="number"
                  name="blockDuration"
                  min="1"
                  max="90"
                  value={block.blockDuration}
                  onChange={(event) => handleBlockChange(index, event)}
                  placeholder={texts.examSubjectAreaDurationPlaceholder}
                />
              </div>
            </label>
            <label htmlFor={`topic${index}`}>
              {texts.topic}
              <div>
                <select
                  id={`topic${index}`}
                  onChange={(event) => handleTopicChange(event, index)}
                >
                  <option value="">{texts.examSelectTopicPlaceholder}</option>

                  {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
        ))}
        <div className="buttonWrapper">
          <div>
            <button
              type="button"
              className="submitButton"
              onClick={handleAddBlock}
            >
              {texts.addBlock}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="submitButton"
              disabled={!title || !selectedCourse}
            >
              {texts.createExam}
            </button>
            <div className="ErrMsgWrapper">
              {" "}
              <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ExamForm;
