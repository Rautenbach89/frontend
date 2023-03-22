import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

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

  const handleSort = (sortBy) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCourses(
      [...courses].sort((a, b) => {
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
    const confirmDelete = window.confirm(texts.confirmDeleteCourse);

    if (confirmDelete) {
      try {
        await axios.delete(`/courses/${_id}`, { data: { _id } });
        setCourses(courses.filter((course) => course._id !== _id));
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          if (err.response.status === 401) {
            setErrMsg(texts.forbiddenError);
          } else if (err.response.status === 404) {
            setErrMsg(texts.notFoundError);
          } else if (err.response.status === 420) {
            setErrMsg(texts.courseUsedError);
          } else {
            setErrMsg(texts.error);
          }
        } else {
          console.log(`Error: ${err.message}`);
          setErrMsg(texts.error);
        }
      }
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.allCourses}</div>
      <p className={errMsg ? "errmsg" : "offscreen"}>
        {errMsg}
      </p>
      <div>
        <table className="CourseTable">
          <thead>
            <tr>
              <th className="td-name">
                <button className="SortButton" onClick={() => handleSort("_id")}>
                  {texts.id}
                </button>
              </th>
              <th className="td-name">
                <button
                  className="SortButton"
                  onClick={() => handleSort("title")}
                >
                  {texts.name}
                </button>
              </th>
              <th className="td-name">
                <button
                  className="SortButton"
                  onClick={() => handleSort("description")}
                >
                  {texts.description}
                </button>
              </th>
              <th className="td-actions">{texts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="td-_id" td>
                  {course._id}
                </td>
                <td className="td-name" td>
                  {course.title}
                </td>
                <td className="td-description">{course.description}</td>
                <td className="td-actions">
                  <Link to={`/courses/edit/${course._id}`}>
                    <button className="EditButton">
                      <FontAwesomeIcon
                        icon={faEdit}
                        fontSize="1.4rem"
                        style={{ color: "black" }}
                      />
                    </button>
                  </Link>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(course._id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      fontSize="1.4rem"
                      style={{ color: "black" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/courses/new" className="LinkButton">
        <button className="submitButton">{texts.newCourse}</button>
      </Link>
    </section>
  );
};

export default Courses;
