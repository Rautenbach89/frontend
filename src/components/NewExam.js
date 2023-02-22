import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

function ExamForm() {
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState([]);
  const [blocks, setBlocks] = useState([]);
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
    console.log(blocks);

    event.preventDefault();
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
      // Redirect to exam page or show success message to user
    } catch (error) {
      console.error(error);
      // Show error message to user
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
            />
          </div>
        </label>
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
        <label>
          {texts.notes}
          <textarea
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value.split("\n"))}
          />
        </label>
        {blocks.map((block, index) => (
          <div key={index}>
            <label>
              {texts.blockName}
              <div>
                <input
                  type="text"
                  name="blockName"
                  value={block.blockName}
                  onChange={(event) => handleBlockChange(index, event)}
                />
              </div>
            </label>
            <label>
              {texts.blockDuration} {texts.inMinutes}
              <div>
                <input
                  type="text"
                  name="blockDuration"
                  value={block.blockDuration}
                  onChange={(event) => handleBlockChange(index, event)}
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
              type="button"
              className="submitButton"
              onClick={handleDeleteBlock}
            >
              {texts.deleteBlock}
            </button>
            <div></div>
            <button type="submit" className="submitButton">
              {texts.createExam}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ExamForm;
