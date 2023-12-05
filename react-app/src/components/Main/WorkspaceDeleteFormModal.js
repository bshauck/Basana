// src/components/Main/WorkspaceDeleteFormModal.js
import ResourceDeleteFormModal from "./ResourceDeleteFormModal";
import { thunkDeleteWorkspace } from "../../store/workspace";

export default function WorkspaceDeleteFormModal({ id }) {
  return (<ResourceDeleteFormModal id={id} resource="workspace" thunkDeleteFunc={thunkDeleteWorkspace} />)
}
