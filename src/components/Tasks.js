import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import useAuth from "../hooks/useAuth";
import {
  faEdit,
  faMagnifyingGlass,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Tasks = () => {
  const ROLES = {
    User: 2001,
    Author: 1984,
    Admin: 5150,
  };

  const [tasks, setTasks] = useState([]);
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;
  const { auth } = useAuth();

  const navigationLinks = [
    {
      path: "/",
      icon: <FontAwesomeIcon icon={faEdit} fontSize="1.4rem" style={{ color: "black" }} />,
      allowedRoles: [ROLES.Author],
    },
    {
      path: "/tasks",
      label: texts.newTask,
      allowedRoles: [ROLES.Author],
    },
  ];

  const filteredNavigationLinks = navigationLinks.filter((link) =>
    auth?.roles?.find((role) => link.allowedRoles?.includes(role))
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // TODO: remove console.logs before deployment
        setTasks(response?.data);
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

    fetchTasks();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(texts.confirmDeleteCourse);

    if (confirmDelete) {
      try {
        await axios.delete(`/tasks/${_id}`, { data: { _id } });
        setTasks(tasks.filter((task) => task._id !== _id));
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
      <div className="headline">{texts.allTasks}</div>
      <div>
        <table className="TaskTable">
          <thead>
            <tr>
              <th className="td-name">{texts.title}</th>
              <th className="td-description">{texts.description}</th>
              <th className="td-course">{texts.course}</th>
              <th className="td-topic">{texts.topic}</th>
              <th className="td-tasktype">{texts.tasktype}</th>
              <th className="td-duration">{texts.duration}</th>
              <th className="td-difficulty">{texts.difficulty}</th>
              <th className="td-points">{texts.points}</th>
              <th className="td-question">{texts.question}</th>
              <th className="td-createdBy">{texts.createdBy}</th>
              <th className="td-actions">{texts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="td-name" td>
                  {task.title}
                </td>
                <td className="td-description">{task.description}</td>
                <td className="td-course">{task.course}</td>
                <td className="td-topic" td>
                  {task.topic}
                </td>
                <td className="td-tasktype">{task.tasktype}</td>
                <td className="td-duration">{task.duration}</td>
                <td className="td-difficulty" td>
                  {task.difficulty}
                </td>
                <td className="td-points">{task.points}</td>
                <td className="td-question">{task.question}</td>
                <td className="td-createdBy" td>
                  {task.createdBy}
                </td>
                <td className="td-actions">
                  <Link to={`/tasks/edit/${task._id}`}>
                    {filteredNavigationLinks[0] &&
                    filteredNavigationLinks[0].allowedRoles ? (
                      <button
                        className="EditButton"
                        style={{
                          display: auth?.roles?.find((role) =>
                            filteredNavigationLinks[0].allowedRoles.includes(
                              role
                            )
                          )
                            ? "block"
                            : "none",
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} fontSize="1.4rem" style={{ color: "black" }} />
                      </button>
                    ) : null}
                  </Link>
                  <Link to={`/tasks/show/${task._id}`}>
                    <button className="ShowButton">
                      <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="1.4rem" style={{ color: "black" }} />
                    </button>
                  </Link>
                  {filteredNavigationLinks[0] &&
                    filteredNavigationLinks[0].allowedRoles &&
                    (auth?.roles?.find((role) =>
                      filteredNavigationLinks[0].allowedRoles.includes(role)
                    ) ? (
                      <button
                        className="DeleteButton"
                        onClick={() => handleDelete(task._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} fontSize="1.4rem" style={{ color: "black" }} />
                      </button>
                    ) : null)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={`/tasks/new`}>
        {filteredNavigationLinks[0] &&
        filteredNavigationLinks[0].allowedRoles ? (
          <button
            className="submitButton"
            style={{
              display: auth?.roles?.find((role) =>
                filteredNavigationLinks[0].allowedRoles.includes(role)
              )
                ? "block"
                : "none",
            }}
          >
            {texts.newTask}
          </button>
        ) : null}
      </Link>
    </section>
  );
};

export default Tasks;
