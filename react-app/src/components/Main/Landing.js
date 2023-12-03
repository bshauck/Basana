import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { thunkGetAllUsers } from "../../store/user";
import { thunkGetAllWorkspaces } from "../../store/workspace";

export default function Landing() {
  const dispatch = useDispatch();
  const users = Object.values(useSelector(state => state.users));
  const workspaces = Object.values(useSelector(state => state.workspaces));

  useEffect(() => {
    dispatch(thunkGetAllUsers());
    // dispatch(thunkGetAllWorkspaces());
  }, [dispatch]);

  /* We will need to show possible collaborators on main page, and
   * current user's workspaces in the profile menu
   */
  if (!(users && users.length) /* || !(workspaces && workspaces.length) */)
    return null;

  return (
    <div className="landing-container">
      <div className="landing-header">
        <h2>Handle a new project! Complete your tasks!</h2>
      </div>
      <div className="landing-body">
      </div>
    </div>
  );
}
