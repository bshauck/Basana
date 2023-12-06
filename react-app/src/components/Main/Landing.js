import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { thunkGetAllUsers } from "../../store/user";
import { thunkGetAllWorkspaces } from "../../store/workspace";
import { thunkGetAllProjects } from "../../store/project";
import { thunkGetAllSections } from "../../store/section";
import { thunkGetAllTasks } from "../../store/task";

export default function Landing() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const users = Object.values(useSelector(state => state.users));
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const projects = Object.values(useSelector(state => state.projects));

  useEffect(() => {
    // dispatch(thunkGetAllSections());
    // dispatch(thunkGetAllTasks());
  }, [dispatch]);

  const [ref] = useState({});
  if (!Array.isArray(users) || !users.length) {
    if (!ref['users']) ref['users'] = dispatch(thunkGetAllUsers());
    return null;
  } else if (ref['users']) delete ref['users']

  if (!Array.isArray(workspaces) || !workspaces.length) {
    if (!ref['workspaces']) ref['workspaces'] = dispatch(thunkGetAllWorkspaces());
    return null;
  } else if (ref['workspaces']) delete ref['workspaces']

  if (!Array.isArray(projects) || !projects.length) {
    if (!ref['projects']) ref['projects'] = dispatch(thunkGetAllProjects());
    return null;
  } else if (ref['projects']) delete ref['projects']

  const hours = new Date().getHours();



  return (
    <div className="landing-container">
      <div className="landing-header">
        <h2>Home</h2>
        <h3>{new Date().toLocaleDateString(undefined, {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'})}</h3>
        <h2>{`Good ${hours < 12 ? "morning" : (hours < 17 ? "afternoon" : "evening")}, ${user.username}`}</h2>

      </div>
      <div className="landing-body">
        <h1>Task Card</h1>
        <h1>Projects Card</h1>
        <h1>Users Card</h1>
      </div>
    </div>
  );
}
