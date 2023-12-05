import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import CreateProjectFormModal from "./CreateProjectFormModal";
import ProjectDeleteFormModal from "./ProjectDeleteFormModal";

function ProjectMenu({ project }) {
//   const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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

  if (!project) return null;

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-down-chevron" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {project !== true && (
          <>
            <li>Project menu</li>
            <OpenModalButton
              buttonText="Create Project"
              onItemClick={closeMenu}
              modalComponent={<CreateProjectFormModal project={project} />}
            />
            <OpenModalButton
              buttonText="Edit Project"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />/*<EditProjectModal />*/}
            />
        </>)} {closeMenu !== false && (
            <OpenModalButton
              buttonText="Delete Project"
              onItemClick={closeMenu}
              modalComponent={<ProjectDeleteFormModal id={project.id} />} />)}
      </ul>
    </>
  )
}

export default ProjectMenu;
