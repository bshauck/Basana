// src/components/SideBar/CurrentWorkspace.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { thunkGetUserWorkspaces } from '../../store/workspace';
import { gotWorkspace } from '../../store/session';

export default function CurrentWorkspace() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const currentWorkspace = useSelector(state => state.session.workspace);

  let userWorkspaces

  useEffect(() => {
    if (!currentUser) return null;
    if (!Array.isArray(userWorkspaceIds) || !userWorkspaceIds.length)
      dispatch(thunkGetUserWorkspaces(currentUser.id))
    else {
      if (!currentWorkspace)
        userWorkspaces = workspaces.filter(w => userWorkspaceIds?.includes(w.id));
        const displayWorkspace = userWorkspaces[0];
        if (displayWorkspace)  {
          console.log("SETTING appWorkspace: ", displayWorkspace);
          dispatch(gotWorkspace(displayWorkspace))
        }
    }
  }, [currentUser, userWorkspaceIds, dispatch, workspaces]);


  if (!currentWorkspace || !userWorkspaceIds) return null;
  else if (!userWorkspaces) userWorkspaces = workspaces.filter(w => userWorkspaceIds.includes(w.id));



  return (
    <div className="team-list">
      <h3>Team</h3>
      <h4>{currentWorkspace.name}</h4>
      <ul>
        {userWorkspaces.map(w => (<li key={w.id} ><NavLink to={`/workspaces/${w.id}`}>{`-----   ${w.name}`}</NavLink></li>))}
      </ul>
    </div>
  )
}
