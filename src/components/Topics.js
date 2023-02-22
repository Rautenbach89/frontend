import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/topics", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // TODO: remove console.logs before deployment

        setTopics(response?.data);
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

    fetchTopics();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm(texts.confirmDeleteCourse);

    if (confirmDelete) {
      try {
        await axios.delete(`/topics/${_id}`, { data: { _id } });
        setTopics(topics.filter((topic) => topic._id !== _id));
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
      <div className="headline">{texts.allTopics}</div>
      <div>
        <table className="TopicTable">
          <thead>
            <tr>
              <th className="td-name">{texts.name}</th>
              <th className="td-description">{texts.description}</th>
              <th className="td-course">{texts.course}</th>
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
                      <EditOutlinedIcon style={{ color: "black" }} />
                    </button>
                  </Link>
                  <button
                    className="DeleteButton"
                    onClick={() => handleDelete(topic._id)}
                  >
                    <DeleteOutlineOutlinedIcon style={{ color: "black" }} />
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
