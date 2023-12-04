import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkGetUserProjects } from "../../store/project";
import ProjectMenu from "./ProjectMenu";

export default function ProjectDetails({ project }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const { projectId } = useState(useParams());
  const displayProject = useSelector(state => state.projects[projectId]);

  const projectIds = useSelector(state => state.session.user?.projects);
  const [ref] = useState({});
  const rKey = 'projects';


  console.log('PDetails projectIds', projectIds, 'displayProject', displayProject)

  if (projectId !== ref) return <h1>SURPRISE P <ProjectMenu /></h1>

  if (!currentUser) return null;

  if (!Array.isArray(projectIds) || !projectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects(currentUser.id));
    else if (ref[rKey]?.errors) console.errors(ref[rKey].errors)
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  if (!displayProject) return null;

  console.log('PDetails rendingering ', projectId, displayProject)



  return (
    <div className="project-main">
      <div className="project-header">
        <h2>Project: {displayProject.name} <span className="prMenu"><i className="fas fa-down-chevron"></i></span></h2>
      </div>
      <div className="project-body">
      </div>
    </div>
  );
}
