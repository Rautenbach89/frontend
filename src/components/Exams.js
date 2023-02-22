import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import useAuth from "../hooks/useAuth";

const Exams = () => {
  const [exams, setExams] = useState([]);
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
        // TODO: remove console.logs before deployment
        setExams(response?.data);
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

    fetchExams();
  });

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(texts.confirmDeleteCourse);

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
              <th className="td-name">{texts.name}</th>
              <th className="td-course">{texts.course}</th>
              <th className="td-duration">{texts.duration}</th>
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
                      <ZoomInOutlinedIcon style={{ color: "black" }} />
                    </button>
                  </Link>
                  <button
                    className="ExportButton"
                    onClick={() => downloadExam(exam)}
                  >
                    {" "}
                    <DownloadIcon style={{ color: "black" }} />
                  </button>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(exam._id)}
                  >
                    <DeleteOutlineOutlinedIcon style={{ color: "black" }} />
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
