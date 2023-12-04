import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

function ProjectMenu({ project }) {
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


  const ulClassName = "project-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-down-chevron" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {project !== true && (
          <>
            <li>{project}</li>
            <OpenModalButton
              buttonText="Create Project"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />/*<CreateProjectModal /> */}
            />
            <OpenModalButton
              buttonText="Edit Project"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />/*<EditProjectModal />*/}
            />
        </>)} {user !== false && (
            <OpenModalButton
              buttonText="Delete Project"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />/*<DeleteProjectModal /> */} />)}
      </ul>
    </>
  )
}

export default ProjectMenu;
