// src/components/SideBar/ProjectList.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { thunkGetUserProjects } from '../../store/project';


export default function ProjectList() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.workspaces[1]);
  const appProject = useSelector(state => state.session.project);
  const projects = Object.values(useSelector(state => state.projects));
  const userProjectIds = useSelector(state => state.session.user?.projects);
  const [ref] = useState({});

  if (!appUser || !appWorkspace) return null;

  const rKey = 'userProjectIds';
  if (!Array.isArray(userProjectIds) || !userProjectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(appUser.id));
    else if (ref[rKey]?.errors) console.error(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  const userProjects = projects.filter(project => userProjectIds.includes(project.id) && project.name !== 'My tasks');
  console.log ('userProjects', userProjects, 'userProjectIds', userProjectIds )

  return (
    <div className="project-list">
      <h3 className='sidebar-title'  > Projects</h3>
      <br/>
      <h4>{appWorkspace.name}</h4>
      <ul>
        {userProjects.map(p => (<NavLink key={p.id} to={`/projects/${p.id}`}> <li >{`-----   ${p.name}`}</li></NavLink>))}
      </ul>
    </div>
  )
}
