import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserWorkspaces } from "../../store/workspace";
import WorkspaceMenu from "./WorkspaceMenu";
import UserCard from "./Card/UserCard";
import ProjectCard from "./Card/ProjectCard";



// import { gotWorkspace } from "../../store/session";
export default function WorkspaceDetails() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);
  // const workspaces = Object.values(useSelector(state => state.workspaces));
  const { workspaceId } = useParams();
  const allNormalizedWorkspaces = useSelector(state => state.workspaces);
  const allWorkspaces = Object.values(allNormalizedWorkspaces)
  const displayWorkspace = useSelector(state => state.workspaces[workspaceId]);


  const [ref] = useState({});
  const rKey = 'workspaces';
  let mappedWorkspace;

  // if (displayWorkspace && (!appWorkspace || appWorkspace.id !== workspaceId)) {
  //   dispatch(gotWorkspace(displayWorkspace))
  // }


  useEffect(() => {
  }, [appWorkspace, displayWorkspace, workspaceId])

  if (!appUser) return null;

  if (!appWorkspace || !appWorkspace.id === workspaceId) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaces(appUser.id));
    // else if (ref[rKey]?.errors) delete ref[rKey]
    return null;
  } else if (ref[rKey]) delete ref[rKey]


  if (!displayWorkspace)
    if (!allWorkspaces) return null;
    else if (allWorkspaces.includes(w => w.id === workspaceId))
      mappedWorkspace = allWorkspaces.find(w => w.id === workspaceId)




  return (
    <div className="workspace-main">
      <div className="workspace-header">
        <h2>Workspace/Team: {displayWorkspace?.name} </h2>
        <WorkspaceMenu  workspace={displayWorkspace} />
      </div>
      <div className="workspace-body">
        <UserCard />
        <ProjectCard />
        {/* <WorkspaceCard /> */}
      </div>
    </div>
  );
}
