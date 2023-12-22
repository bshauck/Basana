import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserProjects } from "../../store/project";
// import ProjectMenu from "./ProjectMenu";
import ProjectSectionTableList from "../ProjectTaskList/ProjectSectionTaskList";

export default function ProjectDetails() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const { projectId } = useParams();
  const appProject = useSelector(state => state.session.project);

  const projectIds = useSelector(state => state.session.user?.projects);
  const [ref] = useState({});
  const rKey = 'projects';


  console.log('PDetails projectIds', projectIds, 'appProject', appProject)

  if (!appUser) return null;

  if (!Array.isArray(projectIds) || !projectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(appUser.id));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  if (!appProject) return null;

  console.log('PDetails rendering ', projectId, appProject)

/* <span className="prMenu"><i className="fas fa-down-chevron"></i></span> */

  return (
    <div className="project-main">
      <div className="project-header">
        <h2>Project: {appProject.name}</h2>
        {/* <ProjectMenu project={appProject} /> */}
      </div>
      <div className="project-body">
        <h1>|</h1>
        <ul>
          <li><ProjectSectionTableList project={appProject} /></li>

          {/* <li><AddSectionLine project={project} /></li> */}
         </ul>
      </div>
    </div>
  );
}
