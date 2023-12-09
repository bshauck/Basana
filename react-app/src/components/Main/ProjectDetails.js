import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserProjects } from "../../store/project";
import ProjectMenu from "./ProjectMenu";

export default function ProjectDetails() {
  const dispatch = useDispatch();
  const appUser = useSelector(state => state.session.user);
  const { projectId } = useParams();
  const displayProject = useSelector(state => state.projects[projectId]);

  const projectIds = useSelector(state => state.session.user?.projects);
  const [ref] = useState({});
  const rKey = 'projects';


  console.log('PDetails projectIds', projectIds, 'displayProject', displayProject)

  if (projectId !== ref) return (<h1>{`Project: ${projectId}`} <ProjectMenu project={displayProject} /></h1>)

  if (!appUser) return null;

  if (!Array.isArray(projectIds) || !projectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(appUser.id));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  if (!displayProject) return null;

  console.log('PDetails rendering ', projectId, displayProject)

/* <span className="prMenu"><i className="fas fa-down-chevron"></i></span> */

  return (
    <div className="project-main">
      <div className="project-header">
        <h2>Project: {`${displayProject ? 'XXXXX' : displayProject.name}`}</h2>
        {/* <ProjectMenu project={displayProject} /> */}
      </div>
      <div className="project-body">
        <h1>Task List for Project with SEctions</h1>

      </div>
    </div>
  );
}
