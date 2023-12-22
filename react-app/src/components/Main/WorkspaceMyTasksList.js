import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserWorkspaceTasks } from "../../store/task";
import SectionTableListHeader from "../ProjectTaskList/SectionTableListHeader";
import AddSectionLine from "../ProjectTaskList/AddSectionLine";
export default function WorkspaceMyTasksList() {
  const dispatch = useDispatch();
// const appUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);
  const { workspaceId } = useParams();

  const project = useSelector(state => state.session.workspace?.projects[0]);
  const taskIds = useSelector(state => state.session.user?.tasks);
  const [myTasks, setMyTasks] = useState(null);
  const [ref] = useState({});
  const rKey = 'myTasks';

  /* The My tasks list is that of an internal project of the combination of the workspace and the user. */
  /* We have the workspace (appWorkspace), and we know the current user. We look through the internal_projects of the user, looking for the one that has the workspaceId. */
  /* then, we get the set of sections for that project, and pass iterate over that, putting up a small talbe for each section. */


  if (!appWorkspace) return null;

  if (!Array.isArray(taskIds)) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaceTasks(workspaceId));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) {
    if (!myTasks)
    setMyTasks(ref[rKey]);
    delete ref[rKey]
  }


  console.log('Task Details rendering ')

/* <span className="prMenu"><i className="fas fa-down-chevron"></i></span> */
/* Get the right */

  return (
    <div className="task-main">
      <div className="task-header">
        <h2>My tasks: {`(${appWorkspace ? appWorkspace.name : 'XXXXX'})`} </h2>
      </div>
      <div className="task-body">
        <h1>|</h1>
        <ul>
          <li><SectionTableListHeader team={appWorkspace} /></li>

          <li><AddSectionLine project={project} /></li>

         </ul>
      </div>
    </div>
  );
}
