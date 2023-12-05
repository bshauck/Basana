// src/components/Main/ProjectDeleteFormModal.js

import ResourceDeleteFormModal from "./ResourceDeleteFormModal";
import { thunkDeleteProject } from "../../store/project";

export default function ProjectDeleteFormModal({ id }) {
  return <ResourceDeleteFormModal id={id} resource="project" thunkDeleteFunc={thunkDeleteProject} />
}
