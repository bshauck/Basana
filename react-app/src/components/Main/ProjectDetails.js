import { useSelector, useDispatch } from "react-redux";
import { thunkGetUserProjects } from "../../store/project";

export default function MainProject() {
  const dispatch = useDispatch();
  const projects = Object.values(useSelector(state => state.projects));
  const projectIds = useSelector(state => state.session.user.projects);
  const rKey = 'projects';

  if (!Array.isArray(projectIds) || !projectIds.length) {
    if (!ref[rKey]) ref[rKey] = dispatch(thunkGetUserProjects());
    // else if (ref[rKey]?.errors) delete ref[rKey]
    return null;
  } else if (ref[rKey]) delete ref[rKey]

  const userProjects = projects.filter(w => projectIds.includes(w.id));

  const displayProject = userProjects[0];

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
