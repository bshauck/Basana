import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import CreateWorkspaceFormModal from "./CreateWorkspaceFormModal";
import WorkspaceDeleteFormModal from "./WorkspaceDeleteFormModal";

function WorkspaceMenu({ workspace }) {
//   const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const user = useSelector(state => state.session.user);

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
    <>
      <button onClick={openMenu}>
        <i className="fas fa-down-chevron" />
      </button>
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
              modalComponent={<LoginFormModal />/*<EditWorkspaceModal />*/}
            />
        </>)} {user !== false && (
            <OpenModalButton
              buttonText="Delete Workspace"
              onItemClick={closeMenu}
              modalComponent={<WorkspaceDeleteFormModal id={workspace.id} /> } />)}
      </ul>
    </>
  )
}

export default WorkspaceMenu;
