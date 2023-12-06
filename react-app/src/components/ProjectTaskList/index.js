import { useState } from "react"


export default ProjectTaskList({ project }) {

    const [sections, setSections] = useState(project.sections.sort((s1, s2) => s1.inex = s2.index))  // array of sorted section objects

    if (!project) return null

    return (
        <div className="task-main">
            <div className="task-header">
                <h2>Project: {project.name} </h2>
            </div>
            <div className="task-body">
                <h1>Task List for Project with Sections</h1>
                <ul>
                    <sectionTableListHeader />
                    {sections.map(section => (
                        <li key={section.id}><SectionTable section={section} /></li>
                    ))}
                    <li><AddSectionLine project={project} /></li>
                </ul>
            </div>
        </div>
    )

}
