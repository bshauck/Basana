

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { thunkDeleteTask } from '../../store/task'
import { thunkDeleteSection } from '../../store/section'





export default function SectionTable({section, project}) {
    const [sectionName, setSectionName] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name: sectionName,
            projectId: project.id
        }
        const answer = await dispatch(thunkDeleteSection(data))
        if (!answer.errors) {
            setSectionName('')
            setSections([...sections, answer])
        }
    }

    const handleDelete = async (e, taskId) => {
        e.preventDefault()
        const answer = await dispatch(thunkDeleteTask(taskId))
        if (answer.errors) {
            console.errors("ERROR DELETING TASK", answer.errors)
        }
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Icons</th>
                        <th>Tasks</th>
                        <th>Due date</th>
                        <th>Project</th>
                        <th>Visibility</th>
                        <th>Collaborators</th>
                        <th>[DELETE]</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>I1 I2</td>
                            <td>{task.title}</td>
                            <td>{task.due}</td>
                            <td>{task.public}</td>
                            <td>{task.collaborators}</td>
                            <td><button onClick={(e) => handleDelete(e, task.id)}>Delete Task</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleSubmit} >
                <input type="text" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
                <button type="submit">Something Section</button>
            </form>
        </div>
    )
}
