import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetUserWorkspaceTasks } from "../../store/task";

export default function WorkspaceMyTasksList() {
  const dispatch = useDispatch();
    const { workspaceId } = useParams();
  const currentUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);

  const taskIds = useSelector(state => state.session.user?.tasks);
  const [myTasks, setMyTasks] = useState(null);
  const [ref] = useState({});
  const rKey = 'myTasks';


  if (!currentUser) return null;

  if (!Array.isArray(taskIds)) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaceTasks(currentUser.id));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) {
    if (!myTasks)
    setMyTasks(ref[rKey]);
    delete ref[rKey]
  }


  console.log('Task Details rendering ')

/* <span className="prMenu"><i className="fas fa-down-chevron"></i></span> */

  if (!myTasks) return null;

  return (
    <div className="task-main">
      <div className="task-header">
        <h2>My tasks: XXXXX </h2>
        {/* <h2>Project: {displayProject.name} </h2> */}
        {/* <ProjectMenu project={displayProject} /> */}
      </div>
      <div className="task-body">
        <h1>Task List for Project with SEctions</h1>
        <ul>
          {myTasks.map(task => (
            <li key={task.id}>
              {/* <TaskDetails task={task} /> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
