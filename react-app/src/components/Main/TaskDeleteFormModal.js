// src/components/Main/TaskDeleteFormModal.js
import ResourceDeleteFormModal from "./ResourceDeleteFormModal";
import { thunkDeleteTask } from "../../store/task";

export default function TaskDeleteFormModal({ id }) {
  return <ResourceDeleteFormModal id={{id}} resource="task" thunkDeleteFunc={thunkDeleteTask} />
}
