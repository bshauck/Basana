import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserWorkspaces } from "../../store/workspace";
import WorkspaceMenu from "./WorkspaceMenu";
import { useContentLoaded } from "../../context/ContentLoaded";
import { gotWorkspace } from "../../store/session";

export default function WorkspaceDetails() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  // const workspaces = Object.values(useSelector(state => state.workspaces));
  const { workspaceId } = useParams();
  const allNormalizedWorkspaces = useSelector(state => state.workspaces);
  const allWorkspaces = Object.values(allNormalizedWorkspaces)
  const displayWorkspace = useSelector(state => state.workspaces[workspaceId]);
  const workspaceIds = useSelector(state => state.session.user?.workspaces);
  const {userLoaded} = useContentLoaded();

  const [ref] = useState({});
  const rKey = 'workspaces';

  console.log('WSDetails: Id', workspaceId, 'displayWorkspace', displayWorkspace)



  useEffect(() => {
    if (!userLoaded) return null;
    else if (!displayWorkspace) dispatch(thunkGetUserWorkspaces(currentUser.id));
    else {
      console.log("SETTING appWorkspace: ", displayWorkspace);
      dispatch(gotWorkspace(displayWorkspace))
    }
  } , [dispatch, currentUser, displayWorkspace, userLoaded]);

  console.log('WDetails workspaceIds', workspaceIds, 'displayWorkspace', displayWorkspace)


  // if (currentUser !== workspaceIds) return (<h1>{`Hello W ${workspaceId}`} <WorkspaceMenu  workspace={displayWorkspace} /></h1>)


  if (!currentUser) return null;

  if (!Array.isArray(workspaceIds) || !workspaceIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaces(currentUser.id));
    // else if (ref[rKey]?.errors) delete ref[rKey]
    return null;
  } else if (ref[rKey]) delete ref[rKey]


  let mapWorkspace = displayWorkspace

  if (!displayWorkspace && !allWorkspaces) return null;
  if (!displayWorkspace)
    if (allWorkspaces.includes(w => w.id === workspaceId))
      mapWorkspace = allWorkspaces.find(w => w.id === workspaceId)
    else return null;


  console.log('WDetails rendering id worksp', workspaceId, displayWorkspace)
/* <span className="wsMenu"><i className="fas fa-down-chevron"></i></span> */


  return (
    <div className="workspace-main">
      <div className="workspace-header">
        <h2>Workspace/Team: {mapWorkspace.name} </h2>
        <WorkspaceMenu  workspace={displayWorkspace} />
      </div>
      <div className="workspace-body">
        <h1>Workspace Members</h1>
        <h1>Workspace Projects</h1>
      </div>
    </div>
  );
}
