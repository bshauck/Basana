// src/components/SideBar/index.js
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { thunkGetAllProjects, thunkGetWorkspaceProjects } from '../../store/project'
import { thunkGetUserWorkspaces } from '../../store/workspace'
import { gotProject, gotWorkspace } from '../../store/session'
import { projectIcon } from '../../utils/helpers'

export default function SideBar() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);
  const appProject = useSelector(state => state.session.project);
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const userProjectIds = useSelector(state => state.session.user?.projects);
  const wsProjectIds = appWorkspace?.projects;

  const workspaces = Object.values(useSelector(state => state.workspaces));
  const projectIds = useSelector(state => state.projects);
  const projects = Object.values(useSelector(state => state.projects));

  const history = useHistory();
  let displayWorkspace


  useEffect(() => {
    if (appUser && !userWorkspaceIds) {
      dispatch(thunkGetUserWorkspaces(appUser.id));
      dispatch(thunkGetAllProjects());
    }
    if (!appWorkspace && userWorkspaceIds) {
        if (workspaces[userWorkspaceIds[0]]) {
          dispatch(thunkGetWorkspaceProjects(userWorkspaceIds[0]))
          console.log("SETTING WORKSPACE in Sidebar/userEffect", workspaces[userWorkspaceIds[0]] )

          dispatch(gotWorkspace(workspaces[userWorkspaceIds[0]]))
        }
    }
  }, [dispatch, appUser, appWorkspace, userWorkspaceIds, wsProjectIds, userProjectIds, projectIds, workspaces]);

  const noDuplicateHistoryPush = (newUrl) => {
    if (history.location.pathname !== newUrl) {
      history.push(newUrl);
    }
  };

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
  function selectWorkspace(workspace) {
    console.log("SETTING WORKSPACE in Sidebar/selectWorkspace", workspace)

    gotWorkspace(workspace)
    noDuplicateHistoryPush(`/workspaces/${workspace.id}`)
  }

  if (!appUser) return <h1>Please login</h1>;
  if (!userWorkspaceIds)  return <h1>No appUserWorkspaceIds</h1>;

  const userWorkspaces = workspaces.filter(w => userWorkspaceIds.includes(w.id));

  if (!appWorkspace)  {
    if (!userWorkspaceIds.length)  return <h1>No appUserWorkspaceIds</h1>;
    if (!workspaces.length)  return <h1>No workspaces</h1>;
    console.log("SETTING WORKSPACE in Sidebar", userWorkspaces[0] )
    dispatch(gotWorkspace(userWorkspaces[0]))
    displayWorkspace = userWorkspaces[0]
  } displayWorkspace = appWorkspace

  if (appWorkspace?.projects?.length) { // need to set wsProjects
    if (!projects.length)  return <h1>No projects ws: {appWorkspace.id} {appWorkspace.name} {appWorkspace.projects} Projects {projects} Length {projects.length}</h1>;
    if (!wsProjectIds || !wsProjectIds.length)  return <h1>No wsProjectIds</h1>;
  }
  const ids = (!wsProjectIds || !wsProjectIds.length) ? appWorkspace?.projects : wsProjectIds;

  const wsProjects = ids ? projects.filter(p => ids.includes(p.id)) : []

  if (!displayWorkspace) return null

{/* <i className={`"${simpleProjectIcon(p)}"`} /> */}


  return (
    <div className="sidebar-container">
      <br/><br/>
      <div className="sidebar-homeMyTasks">
      <div className='sidebar-title sidebar-link' onClick={home} ><i className="fas fa-house" /> Home</div><br/>
      <div className='sidebar-title sidebar-link' onClick={myTasks} ><i className="far fa-clock" /> My Tasks   </div><br/>
      </div>
      <div className="sidebar-projects">
      <h3 className='sidebar-title'  > Projects</h3>

      <br/>
      {wsProjects ?
      <ul>
        {wsProjects.map(p =>
          (<li key={p.id} ><span><div className="sidebar-project-listing">
          <Link to={`/projects/${p.id}`}>
          <div className="projectColorIcon" ><i className={projectIcon(p)} /> </div>
              {` ${p.name}`}
          </Link></div></span>
          </li>))}
      </ul>
      : ''}
      </div>
      <div className="sidebar-teams">
      <div className="team-list"><br/><br/>
      <h3>Team</h3><br/>
      <h4>{displayWorkspace.name}</h4><br/><br/>
      <ul>
        {userWorkspaces.map(w => (<li key={w.id} ><Link style={{color:0xffffff}} to={`/workspaces/${w.id}`}><i className="fas fa-people-group" />   {w.name}</Link></li>))}
        <br /><br /><br /><br />
      </ul>
    </div>
    </div>
    </div>
  )
}
