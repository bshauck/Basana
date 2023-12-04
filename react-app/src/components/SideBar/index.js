// src/components/SideBar/index.js
import ProjectList from './ProjectList'
import CurrentWorkspace from './CurrentWorkspace'


export default function SideBar() {
  return (
    <div className="sidebar-container">
      <br/><br/>
      <p>Home</p><br/>
      <p>My Tasks</p><br/><br/><br/><br/>
      <ProjectList /><br/><br/><br/><br/>
      <CurrentWorkspace />
    </div>
  )
}
