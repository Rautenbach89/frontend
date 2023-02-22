import { NavLink } from "react-router-dom";
import { useContext } from "react";
import useAuth from "../../hooks/useAuth";
import { LanguageContext } from "../../context/LanguageContext";
import en from "../../lang/en.json";
import de from "../../lang/de.json";
import {
  faHouse,
  faFile,
  faGear,
  faUsers,
  faBook,
  faGraduationCap,
  faClipboard,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ROLES = {
  User: 2001,
  Author: 1984,
  Admin: 5150,
};

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const { auth } = useAuth();
  const { language } = useContext(LanguageContext);
  const texts = language === "en" ? en : de;
  console.log("userroles:");
  console.log(auth);

  const navigationLinks = [
    {
      path: "/",
      label: texts.home,
      icon: <FontAwesomeIcon icon={faHouse} />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/tasks",
      label: texts.tasks,
      icon: <FontAwesomeIcon icon={faFile} />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/exams",
      label: texts.exams,
      icon: <FontAwesomeIcon icon={faBook} />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/courses",
      label: texts.courses,
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
      allowedRoles: [ROLES.Author],
    },
    {
      path: "/topics",
      label: texts.topics,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      allowedRoles: [ROLES.Author],
    },
    {
      path: "/users",
      label: texts.users,
      icon: <FontAwesomeIcon icon={faUsers} />,
      allowedRoles: [ROLES.Admin],
    },
    {
      path: "/account",
      label: texts.settings,
      icon: <FontAwesomeIcon icon={faGear} />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
  ];

  const filteredNavigationLinks = navigationLinks.filter((link) =>
    auth?.roles?.find((role) => link.allowedRoles?.includes(role))
  );

  return (
    <nav className={sidebarOpen ? "Sidebar Sidebar--open" : "Sidebar"}>
      <div className="navClose" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faXmark} fontSize="1.8rem" />
      </div>
      <div className="navMain">
        {filteredNavigationLinks.map((link, index) => (
          <NavLink
            key={index}
            activeClassName="active-link"
            to={link.path}
            onClick={toggleSidebar}
          >
            <li><p className="iconWrapper">{link.icon}</p>
              
              {link.label}
            </li>
          </NavLink>
        ))}
      </div>
      <div className="navDivider" />
    </nav>
  );
};

export default Sidebar;
