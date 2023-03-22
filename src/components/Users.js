import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";
import {
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [sortOrder, setSortOrder] = useState("asc");
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users", JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setUsers(response?.data);
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

    fetchUsers();
  }, []);

  const handleSort = (sortBy) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setUsers(
      [...users].sort((a, b) => {
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

  const roleMapping = {
    2001: texts.user,
    1984: texts.author,
    5150: texts.admin,
  };

  const formatRoles = (roles) => {
    return Object.keys(roles)
      .filter((key) => roles[key] !== undefined)
      .map((key) => roleMapping[roles[key]])
      .join(", ");
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.allUsers}</div>
      <div>
        <table className="userTable">
          <thead>
            <tr>
            <th className="td-username">
                <button className="SortButton" onClick={() => handleSort("username")}>
                  {texts.username}
                </button>
              </th>
              <th className="td-roles">
                <button className="SortButton" onClick={() => handleSort("roles")}>
                  {texts.roles}
                </button>
              </th>
              <th className="td-active">
                <button className="SortButton" onClick={() => handleSort("active")}>
                  {texts.active}
                </button>
              </th>
              <th className="td-actions">{texts.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="td-name">{user.username}</td>
                <td className="td-roles">{formatRoles(user.roles)}</td>
                <td className="td-active">
                  {user.active ? texts.yes : texts.no}
                </td>
                <td className="td-actions">
                  <Link to={`/users/edit/${user._id}`}>
                    <button className="EditButton">
                      <FontAwesomeIcon icon={faEdit} fontSize="1.4rem" style={{ color: "black" }} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Users;
