// src/components/SideBar/ProjectList.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { thunkGetUserProjects } from '../../store/project';

export default function ProjectList() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const projects = Object.values(useSelector(state => state.projects));
  const userProjectIds = useSelector(state => state.session.user?.ownedProjects);
  const [ref] = useState({});

  if (!currentUser) return null;

  const rKey = 'userProjectIds';
  if (!Array.isArray(userProjectIds) || !userProjectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(currentUser.id));
    else if (ref[rKey]?.errors) console.error(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  /* probably TODO need to refactor projects */
  const userProjects = projects.filter(project => userProjectIds.includes(project.id)  && project.name !== 'My tasks');
  console.log ('userProjects', userProjects, 'userProjectIds', userProjectIds )

  return (
    <div className="project-list">
      <h3>Projects</h3>
      <ul>
        {userProjects.map(p => (<NavLink key={p.id} to={`/projects/${p.id}`}> <li >{`-----   ${p.name}`}</li></NavLink>))}
      </ul>
    </div>
  )
}
