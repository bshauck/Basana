import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdateProject } from "../../store/project";
// import { ymd } from '../../utils/helpers';
function UpdateProjectFormModal({ project }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(project?.name || "");
  // const [due, setDue] = useState((project?.due && new Date(project.due))|| "");
  const [description, setDescription] = useState(project?.description || "");
  const [isPublic, setIsPublic] = useState(project?.public || false);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);
  const appWorkspace = useSelector(state => state.session.workspace);

  console.log('UpdateProjectFormModal: user', user, 'appWorkspace', appWorkspace)

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkUpdateProject(project.id, { name, description, /* due, */public: isPublic }));
    if (data.errors) setErrors(Object.values(data.errors));
    else closeModal()
  }

  useEffect(() => {
    if (!appWorkspace) dispatch()
  }, [appWorkspace, dispatch])

  if (typeof appWorkspace !== 'object') return null

  return (
    <>
      <h1>Update new project </h1>
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
        {/* <label>
            Due Date:
            <input
            type='date'
                name="due"
                value={due?ymd(due):''}
                onChange={e=>setDue(e.target.value)}
            />
        </label> */}
        <label>
            Description:
            <textarea
            type='text'
                name="description"
                value={description}
                onChange={e=>setDescription(e.target.value)}
            />
        </label>
        <label>
        Public:
        <input
            type="checkbox"
            checked={isPublic}
            onChange={e=>setIsPublic(e.target.checked)} />
      </label>
        <button type="button" onClick={closeModal} >Cancel</button>
        <button type="submit">Update project</button>
      </form>
    </>
  )
}

export default UpdateProjectFormModal
