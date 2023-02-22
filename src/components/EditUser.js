import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import en from "../lang/en.json";
import de from "../lang/de.json";

const EditUser = () => {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState({});
  const [active, setActive] = useState(false);
  const [setError] = useState("");
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;

  useEffect(() => {
    const userId = window.location.pathname.split("/").pop();
    setId(userId);
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/users/${id}`, JSON.stringify(), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setUsername(response.data.username);
        setRoles(getRoleValue(response.data.roles));
        setActive(response.data.active);
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

    fetchUsers(id);
  }, [id]);

  const getRoleValue = (role) => {
    switch (role) {
      case "admin":
        return { User: 2001, Admin: 5150 };
      case "author":
        return { User: 2001, Author: 1984 };
      case "user":
      default:
        return { User: 2001 };
    }
  };

  const handleUserRolesSelect = (event) => {
    setRoles(getRoleValue(event.target.value));
  };

  const handleUserActiveSelect = (event) => {
    setActive(event.target.value === "active");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = { id, username, roles, active };
      await axios.put(`/users/${id}`, user);
      navigate("/users");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <section className="container-wide">
      <div className="headline">{texts.editUser}</div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <h2>
              {texts.username}: {username}
            </h2>
          </label>
          <label htmlFor="roles">
            {texts.roles}
            <div>
              <select id="roles" onChange={handleUserRolesSelect}>
                <option value="user">{texts.user}</option>
                <option value="author">{texts.author}</option>
                <option value="admin">{texts.admin}</option>
              </select>
            </div>
          </label>
          <label htmlFor="active">
            {texts.isUserActive}?
            <div>
              <select
                id="active"
                onChange={handleUserActiveSelect}
                value={active}
              >
                <option value={true}>{texts.active}</option>
                <option value={false}>{texts.inactive}</option>
              </select>
            </div>
          </label>
          <div className="buttonWrapper">
            <button type="submit" className="submitButton">
              {texts.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditUser;
