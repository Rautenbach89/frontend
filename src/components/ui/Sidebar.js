import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import useAuth from "../../hooks/useAuth";
import { LanguageContext } from "../../context/LanguageContext";
import en from "../../lang/en.json";
import de from "../../lang/de.json";

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
      icon: <HomeOutlinedIcon />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/tasks",
      label: texts.tasks,
      icon: <LibraryBooksOutlinedIcon />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/exams",
      label: texts.exams,
      icon: <GradingOutlinedIcon />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
    {
      path: "/courses",
      label: texts.courses,
      icon: <SchoolOutlinedIcon />,
      allowedRoles: [ROLES.Author],
    },
    {
      path: "/topics",
      label: texts.topics,
      icon: <TopicOutlinedIcon />,
      allowedRoles: [ROLES.Author],
    },
    {
      path: "/users",
      label: texts.users,
      icon: <Groups2OutlinedIcon />,
      allowedRoles: [ROLES.Admin],
    },
    {
      path: "/account",
      label: texts.settings,
      icon: <SettingsOutlinedIcon />,
      allowedRoles: [ROLES.User, ROLES.Author, ROLES.Admin],
    },
  ];

  const filteredNavigationLinks = navigationLinks.filter((link) =>
    auth?.roles?.find((role) => link.allowedRoles?.includes(role))
  );

  return (
    <nav className={sidebarOpen ? "Sidebar Sidebar--open" : "Sidebar"}>
      <div className="navClose" onClick={toggleSidebar}>
        <CloseIcon fontSize="large" />
      </div>
      <div className="navMain">
        {filteredNavigationLinks.map((link, index) => (
          <NavLink
            key={index}
            activeClassName="active-link"
            to={link.path}
            onClick={toggleSidebar}
          >
            <li>
              {link.icon}
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
