import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { gotProject } from "../../store/session";
import { useModal } from "../../context/Modal";
import { simplify } from "../../utils/helpers";
import { thunkCreateProject } from "../../store/project";


function CreateProjectFormModal({ project}) {  /* for edit, pass in project */
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const appWorkspace = useSelector(state => state.session.workspace);
  const history = useHistory();

  // const appUser = useSelector(state => state.session.user);
  // console.log('CreateProjectFormModal: appUser', appUser, 'appWorkspace', appWorkspace)

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkCreateProject(appWorkspace.id, { name, public: isPublic }));
    if (data.errors) setErrors(simplify(data));
    else {
      dispatch(gotProject(data))
      closeModal()
      history.push(`/projects/${data.id}`)
    }
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

export default CreateProjectFormModal
