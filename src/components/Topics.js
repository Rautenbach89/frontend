import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import {
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/topics", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setTopics(response?.data);
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

    fetchTopics();
  }, []);

  const handleSort = (sortBy) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTopics(
      [...topics].sort((a, b) => {
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
    const confirmDelete = window.confirm(texts.confirmDeleteTopic);
  
    if (confirmDelete) {
      try {
        await axios.delete(`/topics/${_id}`, { data: { _id } });
        setTopics(topics.filter((topic) => topic._id !== _id));
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
            setErrMsg(texts.topicUsedError);
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
      <div className="headline">{texts.allTopics}</div>
      <p className={errMsg ? "errmsg" : "offscreen"}>
          {errMsg}
        </p>
      <div>
        <table className="TopicTable">
          <thead>
            <tr>
            <th className="td-name">
                <button className="SortButton" onClick={() => handleSort("title")}>
                  {texts.name}
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
              <th className="td-actions">{texts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic._id}>
                <td className="td-name" td>
                  {topic.title}
                </td>
                <td className="td-description">{topic.description}</td>
                <td className="td-course">{topic.course}</td>
                <td className="td-actions">
                  <Link to={`/topics/edit/${topic._id}`}>
                    <button className="EditButton">
                      <FontAwesomeIcon icon={faEdit} fontSize="1.4rem" style={{ color: "black" }} />
                    </button>
                  </Link>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(topic._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} fontSize="1.4rem" style={{ color: "black" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/topics/new" className="LinkButton">
        <button className="submitButton">{texts.newTopic}</button>
      </Link>
    </section>
  );
};

export default Topics;
