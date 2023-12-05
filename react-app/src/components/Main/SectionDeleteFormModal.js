// src/components/Main/SectionDeleteFormModal.js
import ResourceDeleteFormModal from "./ResourceDeleteFormModal";
import { thunkDeleteSection } from "../../store/section";

export default function SectionDeleteFormModal({ id }) {
  return <ResourceDeleteFormModal id={{id}} resource="section" thunkDeleteFunc={thunkDeleteSection} />
}
