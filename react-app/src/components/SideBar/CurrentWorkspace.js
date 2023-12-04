// src/components/SideBar/CurrentWorkspace.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { thunkGetUserWorkspaces } from '../../store/workspace';

export default function ProjectList() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const [ref] = useState({});

  if (!currentUser) return null;

  const rKey = 'userWorkspaceIds';
  if (!Array.isArray(userWorkspaceIds) || !userWorkspaceIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserWorkspaces(currentUser.id));
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  const userWorkspaces = workspaces.filter(w => userWorkspaceIds.includes(w.id));
  const displayWorkspace = userWorkspaces[0];
  if (!displayWorkspace) return null;

  return (
    <div className="team-list">
      <h3>Team</h3>
      <ul>
        {/* <li key={displayWorkspace.id}>{`-----   ${displayWorkspace.name}`}</li> */}
        {userWorkspaces.map(w => (<NavLink key={w.id} to={`/workspaces/${w.id}`}> <li >{`-----   ${w.name}`}</li></NavLink>))}

      </ul>
    </div>
  )
}
