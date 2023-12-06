import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetUserProjects } from "../../store/project";

export default function WorkspaceMyTasksList() {
  const dispatch = useDispatch();
    const { workspaceId } = useParams();
  const currentUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);

  const projectIds = useSelector(state => state.session.user?.projects);
  const [ref] = useState({});
  const rKey = 'projects';


  if (!currentUser) return null;

  if (!Array.isArray(projectIds) || !projectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(currentUser.id));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]


  console.log('Task Details rendering ')

/* <span className="prMenu"><i className="fas fa-down-chevron"></i></span> */

  return (
    <div className="task-main">
      <div className="task-header">
        <h2>My tasks: XXXXX </h2>
        {/* <h2>Project: {displayProject.name} </h2> */}
        {/* <ProjectMenu project={displayProject} /> */}
      </div>
      <div className="task-body">
        <h1>Task List for Project with SEctions</h1>

      </div>
    </div>
  );
}
