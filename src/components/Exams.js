import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import useAuth from "../hooks/useAuth";
import {
  faMagnifyingGlass,
  faDownload,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;
  const { auth } = useAuth();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/exams", {
          params: { createdBy: auth?.user.toString() },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setExams(response?.data);
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

    fetchExams();
  }, [auth]);

  const handleSort = (sortBy) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setExams(
      [...exams].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
  
        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc"
            ? parseInt(valA) - parseInt(valB)
            : parseInt(valB) - parseInt(valA);
        }
      })
    );
  };

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(texts.confirmDeleteExam);

    if (confirmDelete) {
      try {
        await axios.delete(`/exams/${_id}`, { data: { _id } });
        setExams(exams.filter((exam) => exam._id !== _id));
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }
  };

  const downloadExam = (exam) => {
    const examData = {
      title: exam.title,
      course: exam.course,
      examDuration: exam.examDuration,
      examPoints: exam.examPoints,
      notes: exam.notes,
      blocks: exam.blocks,
    };
    const json = JSON.stringify(examData);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exam.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.allExams}</div>
      <div>
        <table className="ExamTable">
          <thead>
            <tr>
            <th className="td-name">
                <button className="SortButton" onClick={() => handleSort("title")}>
                  {texts.title}
                </button>
              </th>
              <th className="td-course">
                <button className="SortButton" onClick={() => handleSort("course")}>
                  {texts.course}
                </button>
              </th>
              <th className="td-duration">
                <button className="SortButton" onClick={() => handleSort("examDuration")}>
                  {texts.duration}
                </button>
              </th>
              <th className="td-actions">{texts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id}>
                <td className="td-name" td>
                  {exam.title}
                </td>
                <td className="td-course">{exam.course}</td>
                <td className="td-duration">
                  {exam.examDuration} {texts.minutes}
                </td>
                <td className="td-actions">
                  <Link to={`/exams/show/${exam._id}`}>
                    <button className="ShowButton">
                      <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="1.4rem" style={{ color: "black" }} />
                    </button>
                  </Link>
                  <button
                    className="ExportButton"
                    onClick={() => downloadExam(exam)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faDownload} fontSize="1.4rem" style={{ color: "black" }} />
                  </button>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(exam._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} fontSize="1.4rem" style={{ color: "black" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/exams/new" className="LinkButton">
        <button className="submitButton">{texts.newExam}</button>
      </Link>
    </section>
  );
};

export default Exams;
