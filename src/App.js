import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/ui/Layout";

import Tasks from "./components/Tasks";
import NewTask from "./components/NewTask";
import EditTask from "./components/EditTask";
import ShowTask from "./components/ShowTask";

import Exams from "./components/Exams";
import NewExam from "./components/NewExam";
import ShowExam from "./components/ShowExam";

import Courses from "./components/Courses";
import NewCourse from "./components/NewCourse";
import EditCourse from "./components/EditCourse";

import Topics from "./components/Topics";
import NewTopic from "./components/NewTopic";
import EditTopic from "./components/EditTopic";

import Users from "./components/Users";
import EditUser from "./components/EditUser";

import Imprint from "./components/Imprint";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";


const ROLES = {
  User: 2001,
  Author: 1984,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
	<Route path="imprint" element={<Imprint />} />
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/tasks" element={<Tasks />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/tasks/new" element={<NewTask />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/tasks/edit/:id" element={<EditTask />} />
        </Route>
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/tasks/show/:id" element={<ShowTask />} />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/exams" element={<Exams />} />
        </Route>
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/exams/new" element={<NewExam />} />
        </Route>
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Author, ROLES.Admin]}
            />
          }
        >
          <Route path="/exams/show/:id" element={<ShowExam />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route exact path="/courses" element={<Courses />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route exact path="/courses/new" element={<NewCourse />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/topics" element={<Topics />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/topics/new" element={<NewTopic />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
          <Route path="/topics/edit/:id" element={<EditTopic />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/users" element={<Users />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
