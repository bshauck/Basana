// src/components/SideBar/index.js
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ProjectList from './ProjectList'
import CurrentWorkspace from './CurrentWorkspace'

import { thunkGetUserProjects } from '../../store/project'
import { thunkGetUserWorkspaces } from '../../store/workspace'


export default function SideBar() {
const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);






  useEffect(() => {
    if (!currentUser) return null;
    dispatch(thunkGetUserProjects(currentUser.id));
    dispatch(thunkGetUserWorkspaces(currentUser.id));
  }, [dispatch, currentUser]);



  return (
    <div className="sidebar-container">
      <br/><br/>
      <p>Home</p><br/>
      <p>My Tasks</p><br/><br/><br/><br/>
      <ProjectList /><br/><br/><br/><br/>
      <CurrentWorkspace />
    </div>
  )
}
