import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { thunkGetAllUsers } from "../../store/user";
import { thunkGetAllWorkspaces } from "../../store/workspace";
import { thunkGetAllProjects } from "../../store/project";
import { thunkGetAllSections } from "../../store/section";
// import { thunkGetAllTasks } from "../../store/task";

export default function Landing() {
  const dispatch = useDispatch();
  const users = Object.values(useSelector(state => state.users));
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const projects = Object.values(useSelector(state => state.projects));

  useEffect(() => { /* for this page we only need current user things, but
  let's make sure we can read everything */
    dispatch(thunkGetAllSections());
    // dispatch(thunkGetAllTasks()); /* none yet */
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



  return (
    <div className="landing-container">
      <div className="landing-header">
        <h2>Handle a new project! Complete your tasks!</h2>
      </div>
      <div className="landing-body">
      </div>
    </div>
  );
}
