import { useSelector, useDispatch } from "react-redux";
import { thunkGetUserWorkspaces } from "../../store/workspace";

export default function MainWorkspace() {
  const dispatch = useDispatch();
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const workspaceIds = useSelector(state => state.session.user.workspaces);
  const rKey = 'workspaces';

  if (!Array.isArray(workspaceIds) || !workspaceIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaces());
    // else if (ref[rKey]?.errors) delete ref[rKey]
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  const userWorkspaces = workspaces.filter(w => workspaceIds.includes(w.id));

  const displayWorkspace = userWorkspaces[0];

  return (
    <div className="workspace-main">
      <div className="workspace-header">
        <h2>Workspace/Team: {displayWorkspace.name} <span className="wsMenu"><i className="fas fa-down-chevron"></i></span></h2>
      </div>
      <div className="workspace-body">
      </div>
    </div>
  );
}
