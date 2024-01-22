import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateProject } from "../../store/project";

/* if task is set, then we are editing an existing task */
/* if project is set, that is our parent project */
/* if section is set, that is our parent */
function CreateTaskFormModal({ task, project, section }) {
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(task ? task.completed : false);
  const [isPublic, setIsPublic] = useState(task ? task.publice : false);
  const [title, setTitle] = useState(task ? task.title : "");
  const [assignee, setAssignee] = useState(task ? task.assignee : "");
  const [due, setDue] = useState(task.due ||"");
  const [description, setDescription] = useState(task ? task.description : "");
//   const [collaborators, setCollaborators] = useState([]);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);


  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkCreateTask(appWorkspace.id, { name, public: isPublic }));
    if (data.errors) setErrors(simplify(data));
    else closeModal()
  }

  useEffect(() => {

    if (!appWorkspace) dispatch()
  }, [appWorkspace, dispatch])

  if (typeof appWorkspace !== 'object') return null

  return (
    <>
      <h1>Create new project </h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li className="error" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Project name
          <input
            type="text"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
        Public:
        <input
            type="checkbox"
            checked={isPublic}
            onChange={e=>setIsPublic(e.target.checked)} />
      </label>
        <button type="submit">Create project</button>
      </form>
    </>
  )
}

export default CreateTaskFormModal
