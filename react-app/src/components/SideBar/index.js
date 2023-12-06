// src/components/SideBar/index.js
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ProjectList from './ProjectList'
import CurrentWorkspace from './CurrentWorkspace'

import { thunkGetUserProjects } from '../../store/project'
import { thunkGetUserWorkspaces } from '../../store/workspace'


export default function SideBar() {
const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const workspace = useSelector(state => state.session.workspace);
  const userProjectIds = useSelector(state => state.session.user?.projects);
  const userWorkspaceIds = useSelector(state => state.session.user?.workspaces);
  const history = useHistory();






  useEffect(() => {
    if (!currentUser) return null;
    dispatch(thunkGetUserProjects(currentUser.id));
    dispatch(thunkGetUserWorkspaces(currentUser.id));
  }, [dispatch, currentUser, userProjectIds, userWorkspaceIds]);

  function home () {
    history.push('/')
}
  function myTasks() {
    history.push(`/workspaces/${workspace.id}/list`)
  }


  return (
    <div className="sidebar-container">
      <br/><br/>
      <p><div className='sidebar-home-title' onClick={home} > Home</div></p><br/>
      <p><div className='sidebar-home-title' onClick={myTasks} > My Tasks   </div></p><br/><br/><br/><br/>
      <ProjectList /><br/><br/><br/><br/>
      <CurrentWorkspace />
    </div>
  )
}
