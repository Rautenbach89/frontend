import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
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
  const [sortOrder, setSortOrder] = useState("asc");
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
        setTasks(response?.data);
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

    fetchTasks();
  }, []);

  const handleSort = (sortBy) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTasks(
      [...tasks].sort((a, b) => {
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
    const confirmDelete = window.confirm(texts.confirmDeleteTask);

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
            <th className="td-title">
                <button className="SortButton" onClick={() => handleSort("title")}>
                  {texts.title}
                </button>
              </th>
              <th className="td-description">
                <button className="SortButton" onClick={() => handleSort("description")}>
                  {texts.description}
                </button>
              </th>
              <th className="td-course">
                <button className="SortButton" onClick={() => handleSort("course")}>
                  {texts.course}
                </button>
              </th>
              <th className="td-topic">
                <button className="SortButton" onClick={() => handleSort("topic")}>
                  {texts.topic}
                </button>
              </th>
              <th className="td-tasktype">
                <button className="SortButton" onClick={() => handleSort("tasktype")}>
                  {texts.tasktype}
                </button>
              </th>
              <th className="td-duration">
                <button className="SortButton" onClick={() => handleSort("duration")}>
                  {texts.duration}
                </button>
              </th>
              <th className="td-difficulty">
                <button className="SortButton" onClick={() => handleSort("difficulty")}>
                  {texts.difficulty}
                </button>
              </th>
              <th className="td-points">
                <button className="SortButton" onClick={() => handleSort("points")}>
                  {texts.points}
                </button>
              </th>
              <th className="td-question">
                <button className="SortButton" onClick={() => handleSort("question")}>
                  {texts.question}
                </button>
              </th>
              <th className="td-createdBy">
                <button className="SortButton" onClick={() => handleSort("createdBy")}>
                  {texts.createdBy}
                </button>
              </th>
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
