import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateWorkspace } from "../../store/workspace";
import { simplify } from "../../utils/helpers";
import { useHistory } from "react-router-dom";
import { gotWorkspace } from "../../store/session";

function CreateWorkspaceFormModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(thunkCreateWorkspace({ name }));
    if (data.errors) setErrors(simplify(data));
    else {
      dispatch(gotWorkspace(data))
      history.push("/")
      closeModal()
    }
  }


  return (
    <>
      <h1>Create new workspace </h1>
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
        <button type="submit">Create workspace</button>
      </form>
    </>
  )
}

export default CreateWorkspaceFormModal
