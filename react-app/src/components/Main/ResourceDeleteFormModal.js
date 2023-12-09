// src/components/ResourceDeleteFormModal.js
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { simplify } from "../../utils/helpers";

  /* For reuse: need resource id for thunk invocation,
     lowercase resource name (workspace, project, section, task) and
     deletion thunk */

export default function ResourceDeleteFormModal({ id, resource, thunkDeleteFunc }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const capitalized = resource[0].toUpperCase() + resource.slice(1)

  const resouceYesDelete = async (e) => {
    e.preventDefault();
    const answer = await dispatch(thunkDeleteFunc(id))
    if (answer.errors) setErrors(simplify(answer))
    else {
        closeModal();
        history.push(`/`)
    }
  }

  return (
      <div className="confirmResourceDeleteModalDiv" >
        <h2>Confirm Delete</h2>
        <ul className="errors">{errors.errors ? (Object.keys(errors.errors).map(k => (
          <li key={k}>{`${k}: ${errors.errors[k]}`}</li>))) : ""}</ul>
        <p className="confirmResourceDeleteModalP" >Are you sure you want to remove this {resource}?</p>
        <div className="resourceDeleteFormButtonDiv">
            <button className="resourceDeleteButton" type="button" onClick={resouceYesDelete}>Yes (Delete {capitalized})</button>
            <button className="resourceNoDeleteButton" type="button" onClick={closeModal}>No (Keep {capitalized})</button>
        </div>
      </div>
  );
}
