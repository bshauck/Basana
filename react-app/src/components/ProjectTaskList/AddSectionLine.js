import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { thunkCreateSection } from '../../store/section'


export default function AddSectionLine({project}) {
    const [sectionName, setSectionName] = useState('')
    const dispatch = useDispatch()

 const  handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name: sectionName,
            projectId: project.id
        }
        const answer = await dispatch(thunkCreateSection(data))
        if (!answer.errors) {
            setSectionName('')
            project.sections.append(answer)
        }
    }

    return (
    <span>  <form onSubmit={handleSubmit} >
             <button type="submit">
            <input type="text" placeholder="+ Add Section" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
            </button>
        </form>
    </span>
    )
}
