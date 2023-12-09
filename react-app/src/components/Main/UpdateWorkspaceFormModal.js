import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdateWorkspace } from "../../store/workspace";
import { simplify } from "../../utils/helpers";

function UpdateWorkspaceFormModal({ workspace }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(workspace.name ||"");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkUpdateWorkspace(workspace.id, { name }));
    if (data.errors) setErrors(simplify(data));
    else closeModal()
  }


  return (
    <>
      <h1>Update new workspace </h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li className="error" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Workspace name
          <input
            type="text"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update workspace</button>
      </form>
    </>
  )
}

export default UpdateWorkspaceFormModal
