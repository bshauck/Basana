// src/components/SideBar/index.js
import { useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { thunkGetUserProjects } from '../../store/project'
import { thunkGetUserWorkspaces } from '../../store/workspace'
// import { gotProject, gotWorkspace } from '../../store/session'
import { gotWorkspace } from '../../store/session'

export default function SideBar() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  let appWorkspace = useSelector(state => state.session.workspace);
  const appProject = useSelector(state => state.session.project);
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const userProjectIds = useSelector(state => state.session.user?.projects);

  const workspaces = Object.values(useSelector(state => state.workspaces));
  const projects = Object.values(useSelector(state => state.projects));

  const history = useHistory();


  useEffect(() => {
    if (appUser && !userWorkspaceIds) {
      dispatch(thunkGetUserWorkspaces(appUser.id));
      dispatch(thunkGetUserProjects(appUser.id));
    }
    if (!appWorkspace && userWorkspaceIds) {
        if (workspaces[userWorkspaceIds[0]]) {
          dispatch(gotWorkspace(workspaces[userWorkspaceIds[0]]))
        }
    }
  }, [dispatch, appUser, appWorkspace, userProjectIds, userWorkspaceIds]);

  // const noDuplicateHistoryPush = (newUrl) => {
  //   if (history.location.pathname !== newUrl) {
  //     history.push(newUrl);
  //   }
  // };

  function home () {
    history.push('/')
  }
  function myTasks() {
    history.push(`/workspaces/${appWorkspace.id}/list`)
  }
  // function selectProject(project) {
  //   gotProject(project)
  //   noDuplicateHistoryPush(`/projects/${project.id}`)
  // }
  // function selectWorkspace(workspace) {
  //   gotWorkspace(workspace)
  //   noDuplicateHistoryPush(`/workspaces/${workspace.id}`)
  // }

  if (!appUser) return <h1>No appUser</h1>;

  if (!userWorkspaceIds)  return <h1>No appUserWorkspaceIds</h1>;
  const userWorkspaces = workspaces.filter(w => userWorkspaceIds.includes(w.id));

  if (!appWorkspace)  {
    if (!userWorkspaceIds.length)  return <h1>No appUserWorkspaceIds</h1>;
    if (!workspaces.length)  return <h1>No workspaces</h1>;
    dispatch(gotWorkspace(userWorkspaces[0]))
    appWorkspace = userWorkspaces[0]
  }

      // return <h1>No appWorkspace</h1>;
      const userProjects = projects.filter(p => userProjectIds.includes(p.id));



  return (
    <div className="sidebar-container">
      <br/><br/>
      <div className='sidebar-title' onClick={home} > Home</div><br/>
      <div className='sidebar-title' onClick={myTasks} > My Tasks   </div><br/><br/><br/><br/>
      <h3 className='sidebar-title'  > Projects</h3>
      <br/>
      <h4>{appProject ? appProject.name : ''}</h4>
      <ul>
        {userProjects.map(p => (<NavLink key={p.id} to={`/projects/${p.id}`}> <li >{`-----   ${p.name}`}</li></NavLink>))}
      </ul>
      <div className="team-list">
      <h3>Team</h3>
      <br/>
      <h4>{appWorkspace.name}</h4>
      <br/><br/>
      <ul>
        {userWorkspaces.map(w => (<li key={w.id} ><NavLink to={`/workspaces/${w.id}`}>{`-----   ${w.name}`}</NavLink></li>))}
      </ul>
    </div>
    </div>
  )
}
