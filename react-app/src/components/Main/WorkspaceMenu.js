import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import CreateWorkspaceFormModal from "./CreateWorkspaceFormModal";
import WorkspaceDeleteFormModal from "./WorkspaceDeleteFormModal";
import UpdateWorkspaceFormModal from "./UpdateWorkspaceFormModal";
import { gotWorkspace } from "../../store/session";
import { useHistory } from "react-router-dom";

function WorkspaceMenu({ workspace, otherWorkspaces}) {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const selectWorkspace = (workspace) => {
      dispatch(gotWorkspace(workspace))
      history.push("/")
      setShowMenu(false)
    }

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  const ulClassName = "workspace-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  if (!workspace) return null;

  return (
      <div className="team-dropdown" >
      <i className="fas fa-chevron-right" onClick={openMenu} />
      {/* <i className="fas fa-down-chevron" onClick={openMenu} /> */}
      <ul className={ulClassName} ref={ulRef}>
        {workspace !== true && (
          <>
            <li>Workspace Menu</li>
            <OpenModalButton
              buttonText="Create Workspace"
              onItemClick={closeMenu}
              modalComponent={<CreateWorkspaceFormModal /> }
            />
            <OpenModalButton
              buttonText="Edit Workspace"
              onItemClick={closeMenu}
              modalComponent={<UpdateWorkspaceFormModal workspace={workspace} />}
            />
        </>)} {user !== false && user.workspaces.length > 1 && (
            <OpenModalButton
              buttonText="Delete Workspace"
              onItemClick={closeMenu}
              modalComponent={<WorkspaceDeleteFormModal id={workspace.id} /> } />)}
        {otherWorkspaces && otherWorkspaces.length &&
        <li className="menu-divider"></li>}
        {otherWorkspaces && otherWorkspaces.map(ws => (
          <li key={ws.id} onClick={() => selectWorkspace(ws)}>
            {ws.name}
          </li>
        ))}

      </ul>
      </div>
  )
}

export default WorkspaceMenu;
