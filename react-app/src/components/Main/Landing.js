import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { thunkGetAllUsers } from "../../store/user";
import { thunkGetAllWorkspaces } from "../../store/workspace";
import { thunkGetAllProjects } from "../../store/project";
import { thunkGetAllSections } from "../../store/section";
import { thunkGetAllTasks } from "../../store/task";
import { thunkGetAllI_Projects } from "../../store/internal_project";
import TaskCard from "./Card/TaskCard";
import ProjectCard from "./Card/ProjectCard";
import UserCard from "./Card/UserCard";

export default function Landing() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const users = Object.values(useSelector(state => state.users));
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const projects = Object.values(useSelector(state => state.projects));
  const [ref] = useState({});

  useEffect(() => {
    if (user) {
    dispatch(thunkGetAllI_Projects)
    dispatch(thunkGetAllSections());
    console.log('Landing: thunkGetAllTasks')
    dispatch(thunkGetAllTasks());
  }
  }, [dispatch, user]);



  if (!user) return null;

  if (!Array.isArray(users) || !users.length) {
    if (!ref['users']) ref['users'] = dispatch(thunkGetAllUsers());
    return null;
  } else if (ref['users']) delete ref['users']

  if (!Array.isArray(workspaces) || !workspaces.length) {
    if (!ref['workspaces']) ref['workspaces'] = dispatch(thunkGetAllWorkspaces());
    return null;
  } else if (ref['workspaces']) delete ref['workspaces']

  if (!Array.isArray(projects)) {
    if (!ref['projects']) ref['projects'] = dispatch(thunkGetAllProjects());
    return null;
  } else if (ref['projects']) delete ref['projects']

  const hours = new Date().getHours();



  return (
    <div className="landing-container">
      <div className="landing-header">
        <h2>Home</h2>
        <div className="landing-header-bottom">
        <h3>{new Date().toLocaleDateString(undefined, {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'})}</h3>
        <h2>{`Good ${hours < 12 ? "morning" : (hours < 17 ? "afternoon" : "evening")}, ${user ? user.username : "!"}`}</h2>
        </div>

      </div>
        <div className="landing-body">
          <ProjectCard />
          <TaskCard />
          <UserCard />
      </div>
      </div>
  );
}
