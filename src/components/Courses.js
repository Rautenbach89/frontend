import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // TODO: remove console.logs before deployment

        setCourses(response?.data);
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

    fetchCourses();
  }, []);

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
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.allCourses}</div>
      <div>
        <table className="CourseTable">
          <thead>
            <tr>
              <th className="td-name">{texts.id}</th>
              <th className="td-name">{texts.name}</th>
              <th className="td-description">{texts.description}</th>
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
                      <EditOutlinedIcon style={{ color: "black" }} />
                    </button>
                  </Link>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(course._id)}
                  >
                    <DeleteOutlineOutlinedIcon style={{ color: "black" }} />
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
