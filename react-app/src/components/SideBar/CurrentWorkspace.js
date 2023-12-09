// src/components/SideBar/CurrentWorkspace.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { thunkGetUserWorkspaces } from '../../store/workspace';

export default function CurrentWorkspace() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const workspaces = Object.values(useSelector(state => state.workspaces));
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const appWorkspace = useSelector(state => state.session.workspace);
  const [ref] = useState({});

  let userWorkspaces

  useEffect(() => {
    if (!appUser) return null;
    if (!userWorkspaceIds)
      dispatch(thunkGetUserWorkspaces(appUser.id))

  }, [appUser, userWorkspaceIds, dispatch, workspaces, appWorkspace]);



  if (!appWorkspace || !userWorkspaceIds) return null;
  else if (!userWorkspaces) userWorkspaces = workspaces.filter(w => userWorkspaceIds.includes(w.id));



  return (
    <div className="team-list">
      <h3>Team</h3>
      <br/>
      <h4>{appWorkspace.name}</h4>
      <br/><br/>
      <ul>
        {userWorkspaces.map(w => (<li key={w.id} ><NavLink to={`/workspaces/${w.id}`}>{`-----   ${w.name}`}</NavLink></li>))}
      </ul>
    </div>
  )
}
