import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateProject } from "../../store/project";

function CreateProjectFormModal({ project}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const user = useSelector(state => state.session.user);


  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkCreateProject(user.workspaces[0].id, { name, public: isPublic }));
    if (data.errors) setErrors(Object.values(data.errors));
    else closeModal()
  }


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
